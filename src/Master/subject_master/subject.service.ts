import { appSource } from "../../core/database/db";
import { SubjectDto, subjectStatus, Subjectvalidation } from "./subject.dto";
import { Request, Response } from "express";
import { SubjectMaster } from "./subject.model";
import subjectRouter from "./subject.controller";
import { Not } from "typeorm";
import { InsertLog } from "../../logs/logs.service";
import { logsDto } from "../../logs/logs.dto";

export const addSubject = async (req: Request, res: Response) => {
  try {
    const payload: SubjectDto = req.body;

    const validation = Subjectvalidation.validate(payload);
    if (validation.error) {
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
      return res.status(400).json({
        ErrorMessage: "Subject  already exists",
      });
    }
    await subjectRepository.save(payload);

    const logsPayload: logsDto = {
      UserId: Number(payload.created_UserId),
      UserName: null,
      statusCode: 200,
      Message: `Subject Added Successfully By - `,
    };
    await InsertLog(logsPayload);

    return res.status(200).json({ IsSuccess: "Subject Added Successfully !!" });
  } catch (error) {
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
  try {
    const payload: SubjectDto = req.body;
    const validation = Subjectvalidation.validate(payload);
    if (validation.error) {
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
      return res.status(400).json({
        ErrorMessage: "Subject Already Exist",
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
      Message: `Subject Updated Successfully By - `,
    };
    await InsertLog(logsPayload);

    return res
      .status(200)
      .json({ IsSuccess: "Subject Updated Successfully !!" });
  } catch (error) {
    return res.status(500).json({
      message: "Internal server error",
      error: error instanceof Error ? error.message : error,
    });
  }
};
export const deleteSubject = async (req: Request, res: Response) => {
  try {
    const subjectCode = Number(req.params.subjectCode);

    if (isNaN(subjectCode)) {
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

    //       const logsPayload: logsDto = {
    //   UserId: Number(payload.created_UserId),
    //   UserName:null,
    //   statusCode: 200,
    //   Message: `Staff Added Successfully By - `,
    // };
    //   await InsertLog(logsPayload);

    // await subjectRepoistry.delete(subjectCode);
    return res.status(200).json({
      IsSuccess: "Subject Deleted Successfully !!",
    });
  } catch (error) {
    return res.status(500).json({
      message: "Internal server error",
      error: error instanceof Error ? error.message : error,
    });
  }
};
export const updateSubjectStatus = async (req: Request, res: Response) => {
  try {
    const payload: subjectStatus = req.body;
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
      Message: `Changed Status for  ${existingSubject.subjectName}Subject to ${payload.status} By - `,
    };
    await InsertLog(logsPayload);
    return res
      .status(200)
      .json({ IsSuccess: "Subject Status updated Successfully" });
  } catch (error) {
    return res.status(500).json({
      message: "Internal server error",
      error: error instanceof Error ? error.message : error,
    });
  }
};
