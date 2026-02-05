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
    const { loginUserName, ...data } = payload;
    await subjectRepository.save(data);

    const logsPayload: logsDto = {
      UserId: Number(payload.created_UserId),
      UserName:loginUserName ,
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
export const getsubjectId = async (req: Request, res: Response) => {
  try {
    const subjectRepoistry = appSource.getRepository(SubjectMaster);
    let subject_Id = await subjectRepoistry.query(
      `SELECT subject_Id
            FROM [${process.env.DB_NAME}].[dbo].[subject_master] 
            Group by subject_Id
            ORDER BY CAST(subject_Id AS INT) DESC;`
    );
    let id = "0";
    if (subject_Id?.length > 0) {
      id = subject_Id[0].subject_Id;
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
        Message: `Validation error: ${validation.error.details[0].message } -`,
      };
      await InsertLog(logsPayload);
      return res.status(400).json({
        message: validation.error.details[0].message,
      });
    }
    // check whether subject exist
    const subjectRepoistry = appSource.getRepository(SubjectMaster);
    const existingSubject = await subjectRepoistry.findOneBy({
      subject_Id: payload.subject_Id,
    });
    if (!existingSubject) {
      const logsPayload: logsDto = {
        UserId: Number(payload.created_UserId),
        UserName: null,
        statusCode: 500,
        Message: `Validation Failed - subject Not Found (Code: ${payload.subject_Id})  by -`,
      };
      await InsertLog(logsPayload);
      return res.status(400).json({
        ErrorMessage: "Subject Doesn't exist",
      });
    }
    //  check subject already exist
    const subjectExist = await subjectRepoistry.findBy({
      subjectName: payload.subjectName,
      subject_Id: Not(payload.subject_Id),
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
    const { loginUserName, ...data } = payload;
    await subjectRepoistry.update(
      { subject_Id: payload.subject_Id },
      data
    );
    const logsPayload: logsDto = {
      UserId: Number(payload.created_UserId),
      UserName: loginUserName,
      statusCode: 200,
      Message: `Updated subject Master - Subject Id : ${existingSubject.subject_Id}, old subjectName :${existingSubject.subject_Id} to new subject Name :${payload.subjectName} Successfully By - `,
    };
    await InsertLog(logsPayload);

    return res
      .status(200)
      .json({ IsSuccess: "Subject Updated Successfully !!" });
  } catch (error) {
    const logsPayload: logsDto = {
      UserId: Number(payload.created_UserId),
      UserName: payload.loginUserName,
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
  const subject_Id = Number(req.params.subject_Id);
  const { loginUserId, loginUserName } = req.body;
  try {
    if (isNaN(subject_Id)) {
      const logsPayload: logsDto = {
        UserId: loginUserId,
        UserName: loginUserName,
        statusCode: 500,
        Message: `Validation Failed - Invalid subject id (${req.params.subject_Id})  by -`,
      };
      await InsertLog(logsPayload);
      return res.status(400).json({
        ErrorMessage: "Invalid subject Id",
      });
    }
    const subjectRepoistry = appSource.getRepository(SubjectMaster);
    // Check whether subjectid exists
    const existingSubject = await subjectRepoistry.findOneBy({
      subject_Id: subject_Id,
    });
    if (!existingSubject) {
      const logsPayload: logsDto = {
        UserId: loginUserId,
        UserName: loginUserName,
        statusCode: 500,
        Message: `Deleted failed  SubjectMaster -subject Id: ${existingSubject.subject_Id}, subjectName: ${existingSubject.subjectName} not found by - `,
      };
      await InsertLog(logsPayload);
      return res.status(404).json({
        ErrorMessage: "subject_Id  not found",
      });
    }
    // set active status
    await subjectRepoistry
      .createQueryBuilder()
      .delete()
      .update(SubjectMaster)
      .set({ isActive: false })
      .where({ subject_Id: subject_Id })
      .execute();

    const logsPayload: logsDto = {
      UserId: loginUserId,
      UserName: loginUserName,
      statusCode: 200,
      Message: `Deleted SubjectMaster  subject Id:${subject_Id} SubjectName:
        ${existingSubject.subjectName} By - `,
    };
    await InsertLog(logsPayload);

    // await subjectRepoistry.delete(subject id);
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
      subject_Id: payload.subject_Id,
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
      .where({ subject_Id: payload.subject_Id })
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
