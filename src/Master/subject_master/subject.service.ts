import { appSource } from "../../core/database/db";
import { SubjectDto, Subjectvalidation } from "./subject.dto";
import { Request, Response } from "express";
import { SubjectMaster } from "./subject.model";
import subjectRouter from "./subject.controller";

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
        message: "Subject  already exists",
      });
    }
    await subjectRepository.save(payload);
    return res.status(200).json({ message: "Subject added successfully" });
  } catch (error) {
    console.log(error);
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
    console.log(error);
  }
};
export const getSubjectDetails = async (req: Request, res: Response) => {
  try {
    const subjectRepoistry = appSource.getRepository(SubjectMaster);
    const subjectM = await subjectRepoistry.createQueryBuilder("").getMany();
    res.status(200).send({
      Result: subjectM,
    });
  } catch (error) {
    console.log(error);
  }
};
export const updateSubject = async(req : Request, res: Response) => {
  try{
      const payload: SubjectDto = req.body;
        const validation = Subjectvalidation.validate(payload);
        if (validation.error) {
          console.log(validation.error, "Validation Error");
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
        message: "Subject Doesn't exist",
      });
    }
  await subjectRepoistry.update({ subjectCode: payload.subjectCode }, payload);
    return res.status(200).json({ message: "Subject Updated successfully" });
  } catch (error) {
    console.error("Update Error:", error);
    return res.status(500).json({
      message: "Internal server error",
      error: error instanceof Error ? error.message : error,
    });
  }
}