import { appSource } from "../../core/database/db";
import { SchoolDto, SchoolValidation } from "./school.dto";
import { Request, Response } from "express";
import { SchoolMaster } from "./school.model";

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
        message: "School  already exists",
      });
    }
    await schoolRepoistry.save(payload);
    return res.status(200).json({ message: "School added successfully" });
  } catch (error) {
    console.log(error);
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
    console.log(error);
  }
};
export const getSchoolDetails = async (req: Request, res: Response) => {
  try {
    const schoolRepoistry = appSource.getRepository(SchoolMaster);
    const schlM = await schoolRepoistry.createQueryBuilder("").getMany();
    res.status(200).send({
      Result: schlM,
    });
  } catch (error) {
    console.log(error);
  }
};
export const updateSchool = async (req: Request, res: Response) => {
  try {
    const payload: SchoolDto = req.body;
    const validation = SchoolValidation.validate(payload);
    if (validation.error) {
      console.log(validation.error, "Validation Error");
      return res.status(400).json({
        message: validation.error.details[0].message,
      });
    }
    // check whether class exist
    const schoolRepoistry = appSource.getRepository(SchoolMaster);
    const existingSchool = await schoolRepoistry.findOneBy({
      schoolCode: payload.schoolCode,
    });
    if (!existingSchool) {
      return res.status(400).json({
        message: "Class Doesn't exist",
      });
    }
    await schoolRepoistry.update({ schoolCode: payload.schoolCode }, payload);
    return res.status(200).json({ message: "School Updated successfully" });
  } catch (error) {
    console.error("Update Error:", error);
    return res.status(500).json({
      message: "Internal server error",
      error: error instanceof Error ? error.message : error,
    });
  }
};
