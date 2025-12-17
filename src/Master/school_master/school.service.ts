import { appSource } from "../../core/database/db";
import {
  DeleteSchoolDto,
  SchoolDto,
  schoolStatus,
  SchoolValidation,
} from "./school.dto";
import { Request, Response } from "express";
import { SchoolMaster } from "./school.model";
import { Not } from "typeorm";
import { logsDto } from "../../logs/logs.dto";
import { InsertLog } from "../../logs/logs.service";

export const addSchool = async (req: Request, res: Response) => {
  try {
    const payload: SchoolDto = req.body;
    const validation = SchoolValidation.validate(payload);
    if (validation.error) {
      return res.status(400).json({
        message: validation.error.details[0].message,
      });
    }
    const schoolRepoistry = appSource.getRepository(SchoolMaster);
    const existingSchool = await schoolRepoistry.findOneBy({
      school: payload.school,
    });

    if (existingSchool) {
      return res.status(400).json({
        ErrorMessage: "School  already exists",
      });
    }
    await schoolRepoistry.save(payload);

    const logsPayload: logsDto = {
      UserId: Number(payload.created_UserId),
      UserName: null,
      statusCode: 200,
      Message: `School Added Successfully By - `,
    };
    await InsertLog(logsPayload);

    return res.status(200).json({ IsSuccess: "School Added Successfully !!" });
  } catch (error) {
    return res.status(500).json({
      message: "Internal server error",
      error: error instanceof Error ? error.message : error,
    });
  }
};
export const getSchoolCode = async (req: Request, res: Response) => {
  try {
    const schoolRepoistry = appSource.getRepository(SchoolMaster);
    let schoolCode = await schoolRepoistry.query(
      `SELECT schoolCode
            FROM [${process.env.DB_NAME}].[dbo].[school_master] 
            Group by schoolCode
            ORDER BY CAST(schoolCode AS INT) DESC;`
    );
    let id = "0";
    if (schoolCode?.length > 0) {
      id = schoolCode[0].schoolCode;
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
export const getSchoolDetails = async (req: Request, res: Response) => {
  try {
    const schoolRepoistry = appSource.getRepository(SchoolMaster);
    const schlM = await schoolRepoistry.find({
      where: { isActive: true },
    });
    res.status(200).send({
      Result: schlM,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Internal server error",
      error: error instanceof Error ? error.message : error,
    });
  }
};
export const updateSchool = async (req: Request, res: Response) => {
  try {
    const payload: SchoolDto = req.body;
    const validation = SchoolValidation.validate(payload);
    if (validation.error) {
      return res.status(400).json({
        message: validation.error.details[0].message,
      });
    }
    // check whether school exist
    const schoolRepoistry = appSource.getRepository(SchoolMaster);
    const existingSchool = await schoolRepoistry.findOneBy({
      schoolCode: payload.schoolCode,
    });
    if (!existingSchool) {
      return res.status(400).json({
        ErrorMessage: "School Doesn't exist",
      });
    }
    // check school already exist
    const schoolExist = await schoolRepoistry.findBy({
      school: payload.school,
      schoolCode: Not(payload.schoolCode),
    });
    if (schoolExist.length > 0) {
      return res.status(400).json({
        ErrorMessage: "School Name Already Exist",
      });
    }

    await schoolRepoistry.update({ schoolCode: payload.schoolCode }, payload);

    const logsPayload: logsDto = {
      UserId: Number(payload.created_UserId),
      UserName: null,
      statusCode: 200,
      Message: `School  Updated Successfully By - `,
    };
    await InsertLog(logsPayload);

    return res
      .status(200)
      .json({ IsSuccess: "School Updated Successfully !!" });
  } catch (error) {
    return res.status(500).json({
      message: "Internal server error",
      error: error instanceof Error ? error.message : error,
    });
  }
};
export const deleteSchool = async (req: Request, res: Response) => {
  try {
    const schoolCode = Number(req.params.schoolCode);
    const { loginUserId, loginUserName } = req.body;

    if (isNaN(schoolCode)) {
      return res.status(400).json({ ErrorMessage: "Invalid school code" });
    }

    const schoolRepoistry = appSource.getRepository(SchoolMaster);

    const existingSchool = await schoolRepoistry.findOneBy({ schoolCode });
    if (!existingSchool) {
      return res.status(404).json({ ErrorMessage: "School not found" });
    }
    //delete and active
    await schoolRepoistry
      .createQueryBuilder()
      .update(SchoolMaster)
      .set({ isActive: false })
      .where({ schoolCode: schoolCode })
      .execute();

    const logsPayload: logsDto = {
      UserId: loginUserId,
      UserName: loginUserName,
      statusCode: 200,
      Message: `Deleted SchoolMaster ${existingSchool.school} By - `,
    };
    await InsertLog(logsPayload);

    return res.status(200).json({
      IsSuccess: "School Deleted Successfully",
    });
  } catch (error) {
    return res.status(500).json({ ErrorMessage: "Internal server error" });
  }
};

export const updateSchoolStatus = async (req: Request, res: Response) => {
  try {
    const payload: schoolStatus = req.body;
    const schoolRepoistry = appSource.getRepository(SchoolMaster);
    const existingSchool = await schoolRepoistry.findOneBy({
      schoolCode: payload.schoolCode,
    });
    if (!existingSchool) {
      return res.status(400).json({
        ErrorMessage: "School not found",
      });
    }
    await schoolRepoistry
      .createQueryBuilder()
      .update(SchoolMaster)
      .set({ status: payload.status })
      .where({ schoolCode: payload.schoolCode })
      .execute();

    const logsPayload: logsDto = {
      UserId: payload.loginUserId,
      UserName: payload.loginUserName,
      statusCode: 200,
      Message: `Changed Status for  ${existingSchool.school} to ${payload.status} By - `,
    };
    await InsertLog(logsPayload);

    return res.status(200).json({
      IsSuccess: "School Status Updated Successfully !!",
    });
  } catch (error) {
    return res.status(500).json({
      message: "Internal server error",
      error: error instanceof Error ? error.message : error,
    });
  }
};
