import { appSource } from "../core/database/db";
import { Request, Response } from "express";
import { studentScoreResult } from "./student-result.model";
import { studentScoreResultDto } from "./student-result.dto";
import { studentScoreResultValidation } from "./student-result.dto";
import { InsertLog } from "../logs/logs.service";
import { logsDto } from "../logs/logs.dto";

export const AddStudentScoreResult = async (req: Request, res: Response) => {
  const payload: studentScoreResultDto = req.body;

  try {
    const Validation = studentScoreResultValidation.validate(payload);
    if (Validation.error) {
      return res.status(400).json({
        message: Validation.error.details[0].message,
      });
    }
    const studentscoreRepository = appSource.getRepository(studentScoreResult);
    // console.log("payload", payload);
    await studentscoreRepository.save(payload);
    const logsPayload: logsDto = {
      UserId: Number(payload.StudentId),
      UserName: payload.studentusername,
      statusCode: 200,
      Message: `Exam Submitted  Successfully, student id: ${payload.StudentId}, student name : ${payload.studentName} , student class: ${payload.ClassName_Id} , By - `,
    };
    await InsertLog(logsPayload);
    return res.status(200).json({ IsSuccess: "submitted successfully" });
  } catch (error) {
    //  console.error('Save error:', error);
    const logsPayload: logsDto = {
      UserId: Number(payload.StudentId),
      UserName: payload.studentName,
      statusCode: 500,
      Message: `Error while submit exam - ${error.message}`,
    };
    await InsertLog(logsPayload);
    return res.status(500).json({
      message: "Failed to save student score",
      error: error instanceof Error ? error.message : error,
    });
  }
};
export const AddTryAgainLog = async (req: Request, res: Response) => {
  const { StudentId, studentName, ClassName_Id,studentusername } = req.body;
  try {
    const logsPayload: logsDto = {
      UserId: Number(StudentId),
      UserName: studentusername,
      statusCode: 200,
      Message: `Try again exam clicked   → StudentId: ${StudentId},Student Name: ${studentName}, Standard: ${ClassName_Id} by -`,
    };
    await InsertLog(logsPayload);

    return res.status(200).json({ IsSuccess: "Try Again logged successfully" });
  } catch (error) {
    const logsPayload: logsDto = {
      UserId: Number(StudentId),
      UserName: studentName,
      statusCode: 200,
      Message: `Error while Try again exam  - ${error.message} `,
    };
    await InsertLog(logsPayload);
    return res.status(500).json({
      message: "Failed to save try again log",
      error: error instanceof Error ? error.message : error,
    });
  }
};

