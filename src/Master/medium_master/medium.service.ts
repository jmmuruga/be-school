import { appSource } from "../../core/database/db";
import { MediumDto, mediumStatus, MediumValidation } from "./medium.dto";
import { Request, Response } from "express";
import { MediumMaster } from "./medium.model";
import mediumRouter from "./medium.controller";
import { Not } from "typeorm";
import { InsertLog } from "../../logs/logs.service";
import { logsDto } from "../../logs/logs.dto";

export const addMedium = async (req: Request, res: Response) => {
  const payload: MediumDto = req.body;
  try {
    //check validation
    const validation = MediumValidation.validate(payload);
    if (validation.error) {
      const logsPayload: logsDto = {
        UserId: Number(payload.created_UserId),
        UserName: null,
        statusCode: 500,
        Message: `Validation error: ${validation.error.details[0].message}`,
      };
      await InsertLog(logsPayload);
      return res.status(400).json({
        message: validation.error.details[0].message,
      });
    }
    const mediumRepoistry = appSource.getRepository(MediumMaster);
    const existingMedium = await mediumRepoistry.findOneBy({
      medium: payload.medium,
    });

    if (existingMedium) {
      const logsPayload: logsDto = {
        UserId: Number(payload.created_UserId),
        UserName: null,
        statusCode: 500,
        Message: `Error while saving Medium - ${payload.medium} (Medium already exists) -`,
      };
      await InsertLog(logsPayload);
      return res.status(400).json({
        ErrorMessage: "This Medium is already Existing !!",
      });
    }
    await mediumRepoistry.save(payload);

    const logsPayload: logsDto = {
      UserId: Number(payload.created_UserId),
      UserName: null,
      statusCode: 200,
      Message: `Added MediumMaster - Medium (${payload.medium})  Successfully By - `,
    };
    await InsertLog(logsPayload);
    return res.status(200).json({ IsSuccess: "Medium Added Successfully !!" });
  } catch (error) {
    const logsPayload: logsDto = {
      UserId: Number(payload.created_UserId),
      UserName: null,
      statusCode: 500,
      Message: `Error while adding  Medium  - ${error.message}`,
    };
    await InsertLog(logsPayload);
    return res.status(500).json({
      message: "Internal server error",
      error: error instanceof Error ? error.message : error,
    });
  }
};
export const getMediumId = async (req: Request, res: Response) => {
  try {
    const mediumRepositry = appSource.getRepository(MediumMaster);
    let medium_Id = await mediumRepositry.query(
      `SELECT medium_Id
            FROM [${process.env.DB_NAME}].[dbo].[medium_master] 
            Group by medium_Id
            ORDER BY CAST(medium_Id AS INT) DESC;`
    );
    let id = "0";
    if (medium_Id?.length > 0) {
      id = medium_Id[0].medium_Id;
    }
    const finalRes = Number(id) + 1;
    res.status(200).send({
      Result: finalRes,
    });
  } catch (error) {
    // console.log(error);
    return res.status(500).json({
      message: "Internal server error",
      error: error instanceof Error ? error.message : error,
    });
  }
};
export const getMediumDetails = async (req: Request, res: Response) => {
  try {
    const mediumRepoistry = appSource.getRepository(MediumMaster);
    const mediumM = await mediumRepoistry.find({
      where: { isActive: true },
    });
    // const mediumM = await mediumRepoistry.createQueryBuilder("").getMany();
    res.status(200).send({
      Result: mediumM,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Internal server error",
      error: error instanceof Error ? error.message : error,
    });
  }
};
export const updateMedium = async (req: Request, res: Response) => {
  const payload: MediumDto = req.body;
  try {
    //check validation
    const validation = MediumValidation.validate(payload);
    if (validation.error) {
      const logsPayload: logsDto = {
        UserId: Number(payload.created_UserId),
        UserName: null,
        statusCode: 500,
        Message: `Validation error: ${validation.error.details[0].message}`,
      };
      await InsertLog(logsPayload);
      return res.status(400).json({
        message: validation.error.details[0].message,
      });
    }
    // check whether medium exist code

    const mediumRepoistry = appSource.getRepository(MediumMaster);
    const existingMedium = await mediumRepoistry.findOneBy({
      medium_Id: payload.medium_Id,
    });
    if (!existingMedium) {
      const logsPayload: logsDto = {
        UserId: Number(payload.created_UserId),
        UserName: null,
        statusCode: 404,
        Message: `Update Medium Failed - medium_Id ${payload.medium_Id} not found`,
      };
      await InsertLog(logsPayload);
      return res.status(400).json({
        ErrorMessage: "Medium Doesn't exist",
      });
    }
    // check medium  already exists
    const mediumExist = await mediumRepoistry.findBy({
      medium: payload.medium,
      medium_Id: Not(payload.medium_Id),
    });
    if (mediumExist.length > 0) {
      const logsPayload: logsDto = {
        UserId: Number(payload.created_UserId),
        UserName: null,
        statusCode: 500,
        Message: `Error while update medium - ${payload.medium} (medium Name already exists) -`,
      };
      await InsertLog(logsPayload);
      return res.status(400).json({
        ErrorMessage: "This Medium is  Already  Existing !!",
      });
    }
    await mediumRepoistry.update({ medium_Id: payload.medium_Id }, payload);

    const logsPayload: logsDto = {
      UserId: Number(payload.created_UserId),
      UserName: null,
      statusCode: 200,
      Message: `Updated Medium Master - medium_Id : ${existingMedium.medium_Id}, old mediumname :${existingMedium.medium} to new medium :${payload.medium} Successfully By - `,
    };
    await InsertLog(logsPayload);

    return res
      .status(200)
      .json({ IsSuccess: "Medium Updated Successfully !!" });
  } catch (error) {
    const logsPayload: logsDto = {
      UserId: Number(payload.created_UserId),
      UserName: null,
      statusCode: 500,
      Message: `Error while  update Medium  - ${error.message}`,
    };
    await InsertLog(logsPayload);
    return res.status(500).json({
      message: "Internal server error",
      error: error instanceof Error ? error.message : error,
    });
  }
};
export const deleteMedium = async (req: Request, res: Response) => {
  const medium_Id = Number(req.params.medium_Id);
  const { loginUserId, loginUserName } = req.body;
  try {
    if (isNaN(medium_Id)) {
      const logsPayload: logsDto = {
        UserId: loginUserId,
        UserName: loginUserName,
        statusCode: 500,
        Message: `Validation error: Invalid Medium Code (${req.params.medium_Id})`,
      };
      await InsertLog(logsPayload);
      return res.status(400).json({
        ErrorMessage: "Invalid class code",
      });
    }
    const mediumRepoistry = appSource.getRepository(MediumMaster);
    // Check whether mediumId exists
    const existingMedium = await mediumRepoistry.findOneBy({
      medium_Id: medium_Id,
    });
    if (!existingMedium) {
      const logsPayload: logsDto = {
        UserId: loginUserId,
        UserName: loginUserName,
        statusCode: 404,
        Message: ` Medium Failed - Medium Id ${medium_Id} not found`,
      };
      await InsertLog(logsPayload);

      return res.status(400).json({
        ErrorMessage: "Medium Id  not found",
      });
    }
    //delete and active
    await mediumRepoistry
      .createQueryBuilder()
      .update(MediumMaster)
      .set({ isActive: false })
      .where({ medium_Id: medium_Id })
      .execute();

    const logsPayload: logsDto = {
      UserId: loginUserId,
      UserName: loginUserName,
      statusCode: 200,
      Message: `Deleted Successfully in  Medium Master medium( ${existingMedium.medium}) By - `,
    };
    await InsertLog(logsPayload);
    return res.status(200).json({
      IsSuccess: "Medium Deleted successfully !!",
    });
  } catch (error) {
    const logsPayload: logsDto = {
      UserId: loginUserId,
      UserName: loginUserName,
      statusCode: 500,
      Message: `Error while delete Medium  - ${error.message}`,
    };
    await InsertLog(logsPayload);
    return res.status(500).json({
      message: "Internal server error",
      error: error instanceof Error ? error.message : error,
    });
  }
};
export const updateMediumStatus = async (req: Request, res: Response) => {
  const payload: mediumStatus = req.body;
  try {
    const mediumRepoistry = appSource.getRepository(MediumMaster);
    const existingMedium = await mediumRepoistry.findOneBy({
      medium_Id: payload.medium_Id,
    });
    if (!existingMedium) {
      const logsPayload: logsDto = {
        UserId: payload.loginUserId,
        UserName: payload.loginUserName,
        statusCode: 500,
        Message: `Validation Error: Invalid Medium Code (${payload.medium_Id})`,
      };
      await InsertLog(logsPayload);
      return res.status(400).json({
        ErrorMessage: "Medium not found",
      });
    }
    await mediumRepoistry
      .createQueryBuilder()
      .update(MediumMaster)
      .set({ status: payload.status })
      .where({ medium_Id: payload.medium_Id })
      .execute();

    const logsPayload: logsDto = {
      UserId: payload.loginUserId,
      UserName: payload.loginUserName,
      statusCode: 200,
      Message: `Changed  Medium Status for  ${existingMedium.medium} Medium to ${payload.status} By - `,
    };
    await InsertLog(logsPayload);
    return res
      .status(200)
      .json({ IsSuccess: "Medium Status updated Successfully !" });
  } catch (error) {
    const logsPayload: logsDto = {
      UserId: payload.loginUserId,
      UserName: payload.loginUserName,
      statusCode: 500,
      Message: ` Error while updating Medium status: ${error.message}`,
    };
    await InsertLog(logsPayload);
    return res.status(500).json({
      message: "Internal server error",
      error: error instanceof Error ? error.message : error,
    });
  }
};
