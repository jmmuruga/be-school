import { appSource } from "../../core/database/db";
import { MarkDto, markStatus, MarkValidation } from "./mark.dto";
import { Request, Response } from "express";
import { MarkMaster } from "./mark.model";
import { Not } from "typeorm";
import { InsertLog } from "../../logs/logs.service";
import { logsDto } from "../../logs/logs.dto";

export const getMarkMasterDetails = async (req: Request, res: Response) => {
  try {
    const markRepository = appSource.getRepository(MarkMaster);
    const MarkM = await markRepository.find({
      where: { isActive: true },
    });
    res.status(200).send({
      Result: MarkM,
    });
    // console.log(res, "mark");
  } catch (error) {
    return res.status(500).json({
      message: "Internal server error",
      error: error instanceof Error ? error.message : error,
    });
  }
};
export const addMark = async (req: Request, res: Response) => {
  const payload: MarkDto = req.body;
  try {
    const validation = MarkValidation.validate(payload);
    if (validation.error) {
      const logsPayload: logsDto = {
        UserId: Number(payload.created_UserId),
        UserName: payload.loginUserName,
        statusCode: 500,
        Message: `Validation error: ${validation.error.details[0].message}`,
      };
      await InsertLog(logsPayload);
      return res.status(400).json({
        message: validation.error.details[0].message,
      });
    }

    const markRepository = appSource.getRepository(MarkMaster);
    const existingMark = await markRepository.findOneBy({
      mark: payload.mark,
    });
    if (existingMark) {
      const logsPayload: logsDto = {
        UserId: Number(payload.created_UserId),
        UserName: payload.loginUserName,
        statusCode: 500,
        Message: `Error while saving Mark - ${payload.mark} (Mark already exists) -`,
      };
      await InsertLog(logsPayload);
      return res.status(400).json({
        ErrorMessage: "Mark already exists",
      });
    }
    const { loginUserName, ...data } = payload;
    await markRepository.save(data);

    const logsPayload: logsDto = {
      UserId: Number(payload.created_UserId),
      UserName: loginUserName,
      statusCode: 200,
      Message: `Added Markmaster- mark (${payload.mark})Successfully By - `,
    };
    await InsertLog(logsPayload);
    return res.status(200).json({ IsSuccess: "Mark Added Successfully !!" });
  } catch (error) {
    const logsPayload: logsDto = {
      UserId: Number(payload.created_UserId),
      UserName: payload.loginUserName,
      statusCode: 500,
      Message: `Error in addMark - ${
        error instanceof Error ? error.message : error
      }`,
    };
    await InsertLog(logsPayload);
    return res.status(500).json({
      message: "Internal server error",
      error: error instanceof Error ? error.message : error,
    });
  }
};
export const getMarkId = async (req: Request, res: Response) => {
  try {
    const markRepositry = appSource.getRepository(MarkMaster);
    let mark_Id = await markRepositry.query(
      `SELECT mark_Id
            FROM [${process.env.DB_NAME}].[dbo].[mark_master] 
            Group by mark_Id
            ORDER BY CAST(mark_Id AS INT) DESC;`
    );
    let id = "0";
    if (mark_Id?.length > 0) {
      id = mark_Id[0].mark_Id;
    }
    const finalRes = Number(id) + 1;
    res.status(200).send({
      Result: finalRes,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Internal server error",
      error: error instanceof Error ? error.message : error,
    });
  }
};
export const updateMark = async (req: Request, res: Response) => {
  const payload: MarkDto = req.body;
  try {
    const validation = MarkValidation.validate(payload);
    if (validation.error) {
      const logsPayload: logsDto = {
        UserId: Number(payload.created_UserId),
        UserName: payload.loginUserName,
        statusCode: 500,
        Message: `Validation error: ${validation.error.details[0].message}`,
      };
      await InsertLog(logsPayload);
      return res.status(400).json({
        message: validation.error.details[0].message,
      });
    }
    //check  whether mark exist
    const markRepository = appSource.getRepository(MarkMaster);
    const existingMark = await markRepository.findOneBy({
      mark_Id: payload.mark_Id,
    });
    if (!existingMark) {
      const logsPayload: logsDto = {
        UserId: Number(payload.created_UserId),
        UserName: payload.loginUserName,
        statusCode: 404,
        Message: `Update Mark Failed - mark_Id ${payload.mark_Id} not found`,
      };
      await InsertLog(logsPayload);
      return res.status(400).json({
        ErrorMessage: "Mark Doesn't exist",
      });
    }
    // check mark already exist
    const markExist = await markRepository.findBy({
      mark: payload.mark,
      mark_Id: Not(payload.mark_Id),
    });
    if (markExist.length > 0) {
      const logsPayload: logsDto = {
        UserId: Number(payload.created_UserId),
        UserName: payload.loginUserName,
        statusCode: 500,
        Message: `Error while update mark - ${payload.mark} (mark  already exists) -`,
      };
      await InsertLog(logsPayload);
      return res.status(400).json({
        ErrorMessage: "This Mark is Already Existing !!",
      });
    }
    const {loginUserName, ...data} = payload
    await markRepository.update({ mark_Id: payload.mark_Id }, data);
    const logsPayload: logsDto = {
      UserId: Number(payload.created_UserId),
      UserName: loginUserName,
      statusCode: 200,
      Message: `Updated Mark Master - Mark Id : ${existingMark.mark_Id} ,old Mark :${existingMark.mark} to new Mark :${payload.mark} Successfully By - `,
    };
    await InsertLog(logsPayload);
    return res.status(200).json({ IsSuccess: "Mark Updated successfully" });
  } catch (error) {
    const logsPayload: logsDto = {
      UserId: Number(payload.created_UserId),
      UserName: payload.loginUserName,
      statusCode: 500,
      Message: `Error in updateMark - ${
        error instanceof Error ? error.message : error
      }`,
    };
    await InsertLog(logsPayload);
    return res.status(500).json({
      message: "Internal server error",
      error: error instanceof Error ? error.message : error,
    });
  }
};
export const deleteMarks = async (req: Request, res: Response) => {
  const mark_Id = Number(req.params.mark_Id);
  const { loginUserId, loginUserName } = req.body;
  try {
    if (isNaN(mark_Id)) {
      const logsPayload: logsDto = {
        UserId: loginUserId,
        UserName: loginUserName,
        statusCode: 400,
        Message: `Invalid Mark Id received for Delete: ${req.params.mark_Id}`,
      };
      await InsertLog(logsPayload);
      return res.status(400).json({
        message: "Invalid Mark Code",
      });
    }
    const markRepository = appSource.getRepository(MarkMaster);
    // check whether markid exists
    const existingMark = await markRepository.findOneBy({ mark_Id: mark_Id });

    if (!existingMark) {
      const logsPayload: logsDto = {
        UserId: loginUserId,
        UserName: loginUserName,
        statusCode: 404,
        Message: `Delete Failed - MarkId ${mark_Id} not found`,
      };
      await InsertLog(logsPayload);
      return res.status(404).json({
        ErrorMessage: "Mark Id not found",
      });
    }
    await markRepository
      .createQueryBuilder()
      .delete()
      .update(MarkMaster)
      .set({ isActive: false })
      .where({ mark_Id: mark_Id })
      .execute();
    const logsPayload: logsDto = {
      UserId: loginUserId,
      UserName: loginUserName,
      statusCode: 200,
      Message: `Deleted MarkMaster -${existingMark.mark} By - `,
    };
    await InsertLog(logsPayload);
    return res.status(200).json({
      IsSuccess: "Mark deleted successfully !!",
    });
  } catch (error) {
    const logsPayload: logsDto = {
      UserId: loginUserId,
      UserName: loginUserName,
      statusCode: 500,
      Message: `Error in deleteMarks - ${
        error instanceof Error ? error.message : error
      }`,
    };
    await InsertLog(logsPayload);
    return res.status(500).json({
      message: "Internal server error",
      error: error instanceof Error ? error.message : error,
    });
  }
};
export const updateMarkStatus = async (req: Request, res: Response) => {
  const payload: markStatus = req.body;
  try {
    const markRepository = appSource.getRepository(MarkMaster);
    // check whether markid exists
    const existingMark = await markRepository.findOneBy({
      mark_Id: payload.mark_Id,
    });
    if (!existingMark) {
      const logsPayload: logsDto = {
        UserId: payload.loginUserId,
        UserName: payload.loginUserName,
        statusCode: 404,
        Message: `Update Mark Status Failed - Mark Id ${payload.mark_Id} not found`,
      };
      await InsertLog(logsPayload);
      return res.status(400).json({
        ErrorMessage: "Mark not found",
      });
    }
    await markRepository
      .createQueryBuilder()
      .update(MarkMaster)
      .set({ status: payload.status })
      .where({ mark_Id: payload.mark_Id })
      .execute();
    const logsPayload: logsDto = {
      UserId: payload.loginUserId,
      UserName: payload.loginUserName,
      statusCode: 200,
      Message: `Changed  mark master Status for  ${existingMark.mark} Mark to ${payload.status} By - `,
    };
    await InsertLog(logsPayload);
    return res.status(200).json({
      IsSuccess: "Mark status updated Successfully !",
    });
  } catch (error) {
    const logsPayload: logsDto = {
      UserId: payload.loginUserId,
      UserName: payload.loginUserName,
      statusCode: 500,
      Message: `Error while updating mark status - ${error.message}`,
    };
    await InsertLog(logsPayload);
    return res.status(500).json({
      message: "Internal server error",
      error: error instanceof Error ? error.message : error,
    });
  }
};
