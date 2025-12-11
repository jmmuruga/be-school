import { appSource } from "../core/database/db";
import { Request, Response } from "express";
import { studentScoreResult } from "./student-result.model";
import { studentScoreResultDto } from "./student-result.dto";
import { studentScoreResultValidation } from "./student-result.dto";

export const AddStudentScoreResult = async (req: Request, res: Response) => {
  try {
    const payload: studentScoreResultDto = req.body;
    const Validation = studentScoreResultValidation.validate(payload);
    if (Validation.error) {
      return res.status(400).json({
        message: Validation.error.details[0].message,
      });
    }
    const studentscoreRepository = appSource.getRepository(studentScoreResult);
    console.log("payload", payload);
    await studentscoreRepository.save(payload);
    console.log('Save successful');
    return res.status(200).json({ IsSuccess: "save successfully" });
  } catch (error) {
     console.error('Save error:', error);
  return res.status(500).json({
    message: "Failed to save student score",
    error: error instanceof Error ? error.message : error,
  });
  }
};
