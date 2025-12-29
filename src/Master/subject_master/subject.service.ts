import { appSource } from "../../core/database/db";
import { SubjectDto, subjectStatus, Subjectvalidation } from "./subject.dto";
import { Request, Response } from "express";
import { SubjectMaster } from "./subject.model";
// import subjectRouter from "./subject.controller";
import { Not } from "typeorm";
import { InsertLog } from "../../logs/logs.service";
import { logsDto } from "../../logs/logs.dto";
import { number } from "joi";
export const addSubject = async (req: Request, res: Response) => {
  const payload: SubjectDto = req.body;
  try {
    const validation = Subjectvalidation.validate(payload);
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
    const subjectRepository = appSource.getRepository(SubjectMaster);
    const existingSubject = await subjectRepository.findOneBy({
      subjectName: payload.subjectName,
      subjectType: payload.subjectType,
      selectedClasses: payload.selectedClasses,
    });

    if (existingSubject) {
      const logsPayload: logsDto = {
        UserId: Number(payload.created_UserId),
        UserName: null,
        statusCode: 500,
        Message: `Error while saving subject - ${payload.subjectName} (Subject already exists) - `,
      };
      await InsertLog(logsPayload);
      return res.status(400).json({
        ErrorMessage: "This Subject is already existing",
      });
    }
    await subjectRepository.save(payload);

    const logsPayload: logsDto = {
      UserId: Number(payload.created_UserId),
      UserName: null,
      statusCode: 200,
      Message: `Added subjectMaster -Subject(${payload.subjectName}) Successfully By - `,
    };
    await InsertLog(logsPayload);

    return res.status(200).json({ IsSuccess: "Subject Added Successfully !!" });
  } catch (error) {
    const logsPayload: logsDto = {
      UserId: Number(payload.created_UserId),
      UserName: null,
      statusCode: 500,
      Message: `Error while adding subject - ${error.message}`,
    };
    await InsertLog(logsPayload);
    return res.status(500).json({
      message: "Internal server error",
      error: error instanceof Error ? error.message : error,
    });
  }
};
export const getsubjectCode = async (req: Request, res: Response) => {
  try {
    const subjectRepoistry = appSource.getRepository(SubjectMaster);
    let subjectCode = await subjectRepoistry.query(
      `SELECT subjectCode
            FROM [${process.env.DB_NAME}].[dbo].[subject_master] 
            Group by subjectCode
            ORDER BY CAST(subjectCode AS INT) DESC;`
    );
    let id = "0";
    if (subjectCode?.length > 0) {
      id = subjectCode[0].subjectCode;
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
export const getSubjectDetails = async (req: Request, res: Response) => {
  try {
    const subjectRepoistry = appSource.getRepository(SubjectMaster);
    const subjectM = await subjectRepoistry.find({
      where: { isActive: true },
    });
    res.status(200).send({
      Result: subjectM,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Internal server error",
      error: error instanceof Error ? error.message : error,
    });
  }
};
export const updateSubject = async (req: Request, res: Response) => {
  const payload: SubjectDto = req.body;
  try {
    const validation = Subjectvalidation.validate(payload);
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
    // check whether class exist
    const subjectRepoistry = appSource.getRepository(SubjectMaster);
    const existingSubject = await subjectRepoistry.findOneBy({
      subjectCode: payload.subjectCode,
    });
    if (!existingSubject) {
      const logsPayload: logsDto = {
        UserId: Number(payload.created_UserId),
        UserName: null,
        statusCode: 500,
        Message: `Validation Failed - subject Not Found (Code: ${payload.subjectCode})  by -`,
      };
      await InsertLog(logsPayload);
      return res.status(400).json({
        ErrorMessage: "Subject Doesn't exist",
      });
    }
    //  check subject already exist
    const subjectExist = await subjectRepoistry.findBy({
      subjectName: payload.subjectName,
      subjectCode: Not(payload.subjectCode),
    });
    if (subjectExist.length > 0) {
      const logsPayload: logsDto = {
        UserId: Number(payload.created_UserId),
        UserName: null,
        statusCode: 500,
        Message: `Error while update Subject - ${payload.subjectName} (Subject Name already exists) -`,
      };
      await InsertLog(logsPayload);
      return res.status(400).json({
        ErrorMessage: "This Subject is Already Existing",
      });
    }

    await subjectRepoistry.update(
      { subjectCode: payload.subjectCode },
      payload
    );
    const logsPayload: logsDto = {
      UserId: Number(payload.created_UserId),
      UserName: null,
      statusCode: 200,
      Message: `Updated subject Master - SubjectCode : ${existingSubject.subjectCode}, old subjectName :${existingSubject.subjectCode} to new medium :${payload.subjectName} Successfully By - `,
    };
    await InsertLog(logsPayload);

    return res
      .status(200)
      .json({ IsSuccess: "Subject Updated Successfully !!" });
  } catch (error) {
    const logsPayload: logsDto = {
      UserId: Number(payload.created_UserId),
      UserName: null,
      statusCode: 500,
      Message: `Error while update subject -${error.message}`,
    };
    await InsertLog(logsPayload);
    return res.status(500).json({
      message: "Internal server error",
      error: error instanceof Error ? error.message : error,
    });
  }
};
export const deleteSubject = async (req: Request, res: Response) => {
  const subjectCode = Number(req.params.subjectCode);
  const { loginUserId, loginUserName } = req.body;
  try {
    if (isNaN(subjectCode)) {
      const logsPayload: logsDto = {
        UserId: loginUserId,
        UserName: loginUserName,
        statusCode: 500,
        Message: `Validation Failed - Invalid subject Code (${req.params.subjectCode})  by -`,
      };
      await InsertLog(logsPayload);
      return res.status(400).json({
        ErrorMessage: "Invalid class code",
      });
    }
    const subjectRepoistry = appSource.getRepository(SubjectMaster);
    // Check whether subjectcode exists
    const existingSubject = await subjectRepoistry.findOneBy({
      subjectCode: subjectCode,
    });
    if (!existingSubject) {
      const logsPayload: logsDto = {
        UserId: loginUserId,
        UserName: loginUserName,
        statusCode: 500,
        Message: `Deleted failed  SubjectMaster -subjectCode: ${existingSubject.subjectCode}, subjectName: ${existingSubject.subjectName} not found by - `,
      };
      await InsertLog(logsPayload);
      return res.status(404).json({
        ErrorMessage: "subjectCode  not found",
      });
    }
    // set active status
    await subjectRepoistry
      .createQueryBuilder()
      .delete()
      .update(SubjectMaster)
      .set({ isActive: false })
      .where({ subjectCode: subjectCode })
      .execute();

    const logsPayload: logsDto = {
      UserId: loginUserId,
      UserName: loginUserName,
      statusCode: 200,
      Message: `Deleted SubjectMaster  subjectcode:${subjectCode} SubjectName:
        ${existingSubject.subjectName} By - `,
    };
    await InsertLog(logsPayload);

    // await subjectRepoistry.delete(subjectCode);
    return res.status(200).json({
      IsSuccess: "Subject Deleted Successfully !!",
    });
  } catch (error) {
    const logsPayload: logsDto = {
      UserId: loginUserId,
      UserName: loginUserName,
      statusCode: 500,
      Message: `Error while deleting subject - ${error.message}`,
    };
    await InsertLog(logsPayload);
    return res.status(500).json({
      message: "Internal server error",
      error: error instanceof Error ? error.message : error,
    });
  }
};
export const updateSubjectStatus = async (req: Request, res: Response) => {
  const payload: subjectStatus = req.body;
  try {
    const subjectRepoistry = appSource.getRepository(SubjectMaster);
    const existingSubject = await subjectRepoistry.findOneBy({
      subjectCode: payload.subjectCode,
    });
    if (!existingSubject) {
      return res.status(400).json({
        ErrorMessage: "Subject not found",
      });
    }
    await subjectRepoistry
      .createQueryBuilder()
      .update(SubjectMaster)
      .set({ status: payload.status })
      .where({ subjectCode: payload.subjectCode })
      .execute();

    const logsPayload: logsDto = {
      UserId: payload.loginUserId,
      UserName: payload.loginUserName,
      statusCode: 200,
      Message: `Changed subjectMaster Status for  ${existingSubject.subjectName}Subject to ${payload.status} By - `,
    };
    await InsertLog(logsPayload);
    return res
      .status(200)
      .json({ IsSuccess: "Subject Status updated Successfully" });
  } catch (error) {
    const logsPayload: logsDto = {
      UserId: payload.loginUserId,
      UserName: payload.loginUserName,
      statusCode: 500,
      Message: `Error while updating subject  status - ${error.message}`,
    };
    await InsertLog(logsPayload);
    return res.status(500).json({
      message: "Internal server error",
      error: error instanceof Error ? error.message : error,
    });
  }
};
