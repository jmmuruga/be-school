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
  const payload: SchoolDto = req.body;
  try {
    const validation = SchoolValidation.validate(payload);
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
    const schoolRepoistry = appSource.getRepository(SchoolMaster);
    const existingSchool = await schoolRepoistry.findOneBy({
      school: payload.school,
    });

    if (existingSchool) {
      const logsPayload: logsDto = {
        UserId: Number(payload.created_UserId),
        UserName: null,
        statusCode: 500,
        Message: `Error while saving school - ${payload.school} (School already exists) -`,
      };
      await InsertLog(logsPayload);
      return res.status(400).json({
        ErrorMessage: "This School is already Existing !!",
      });
    }
    await schoolRepoistry.save(payload);

    const logsPayload: logsDto = {
      UserId: Number(payload.created_UserId),
      UserName: null,
      statusCode: 200,
      Message: `Added SchoolMaster - schoolname (${payload.school})Successfully By - `,
    };
    await InsertLog(logsPayload);
    return res.status(200).json({ IsSuccess: "School Added Successfully !!" });
  } catch (error) {
    const logsPayload: logsDto = {
      UserId: Number(payload.created_UserId),
      UserName: null,
      statusCode: 500,
      Message: `Internal server error while adding School: ${error.message}`,
    };
    await InsertLog(logsPayload);
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
  const payload: SchoolDto = req.body;
  try {
    const validation = SchoolValidation.validate(payload);
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
    // check whether school exist
    const schoolRepoistry = appSource.getRepository(SchoolMaster);
    const existingSchool = await schoolRepoistry.findOneBy({
      schoolCode: payload.schoolCode,
    });
    if (!existingSchool) {
      const logsPayload: logsDto = {
        UserId: Number(payload.created_UserId),
        UserName: null,
        statusCode: 500,
        Message: `Error: School not found for Code ${payload.schoolCode}`,
      };
      await InsertLog(logsPayload);
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
      const logsPayload: logsDto = {
        UserId: Number(payload.created_UserId),
        UserName: null,
        statusCode: 500,
        Message: `Error while update School - ${payload.school} (School Name already exists) -`,
      };
      await InsertLog(logsPayload);
      return res.status(400).json({
        ErrorMessage: "This School Name Already Existing !!",
      });
    }

    await schoolRepoistry.update({ schoolCode: payload.schoolCode }, payload);

    const logsPayload: logsDto = {
      UserId: Number(payload.created_UserId),
      UserName: null,
      statusCode: 200,
      Message: `Updated schoolMaster - schoolCode: ${existingSchool.schoolCode}, Old schoolName: ${existingSchool.school} to  New schoolName: ${payload.school} successfully by-`,
    };
    await InsertLog(logsPayload);

    return res
      .status(200)
      .json({ IsSuccess: "School Updated Successfully !!" });
  } catch (error) {
    const logsPayload: logsDto = {
      UserId: Number(payload.created_UserId),
      UserName: null,
      statusCode: 500,
      Message: `Internal server error while updating School: ${error.message}`,
    };
    await InsertLog(logsPayload);
    return res.status(500).json({
      message: "Internal server error",
      error: error instanceof Error ? error.message : error,
    });
  }
};
export const deleteSchool = async (req: Request, res: Response) => {
  const schoolCode = Number(req.params.schoolCode);
  const { loginUserId, loginUserName } = req.body;
  try {
    if (isNaN(schoolCode)) {
      const logsPayload: logsDto = {
        UserId: loginUserId,
        UserName: loginUserName,
        statusCode: 500,
        Message: `Invalid School Code (${req.params.schoolCode})`,
      };
      await InsertLog(logsPayload);

      return res.status(400).json({ ErrorMessage: "Invalid school code" });
    }
    const schoolRepoistry = appSource.getRepository(SchoolMaster);

    const existingSchool = await schoolRepoistry.findOneBy({ schoolCode });
    if (!existingSchool) {
      const logsPayload: logsDto = {
        UserId: loginUserId,
        UserName: loginUserName,
        statusCode: 500,
        Message: `School not found for Code ${schoolCode}`,
      };
      await InsertLog(logsPayload);
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
    const logsPayload: logsDto = {
      UserId: loginUserId,
      UserName: loginUserName,
      statusCode: 500,
      Message: `Internal server error while deleting School: ${error.message}`,
    };
    await InsertLog(logsPayload);
    return res.status(500).json({
      message: "Internal server error",
      error: error instanceof Error ? error.message : error,
    });
  }
};

export const updateSchoolStatus = async (req: Request, res: Response) => {
  const payload: schoolStatus = req.body;
  try {
    const schoolRepoistry = appSource.getRepository(SchoolMaster);
    const existingSchool = await schoolRepoistry.findOneBy({
      schoolCode: payload.schoolCode,
    });
    if (!existingSchool) {
      const logsPayload: logsDto = {
        UserId: payload.loginUserId,
        UserName: payload.loginUserName,
        statusCode: 500,
        Message: `School not found for schoolCode ${payload.schoolCode}`,
      };
      await InsertLog(logsPayload);
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
      Message: `Changed  School Status for  ${existingSchool.school} to ${payload.status} By - `,
    };
    await InsertLog(logsPayload);

    return res.status(200).json({
      IsSuccess: "School Status Updated Successfully !!",
    });
  } catch (error) {
    const logsPayload: logsDto = {
      UserId: payload.loginUserId,
      UserName: payload.loginUserName,
      statusCode: 500,
      Message: `Internal server error while updating School status: ${
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
