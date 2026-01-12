import { appSource } from "../core/database/db";
import { Request, Response } from "express";
import { studentScoreResult } from "./student-result.model";
import { studentScoreResultDto } from "./student-result.dto";
import { studentScoreResultValidation } from "./student-result.dto";
import { InsertLog } from "../logs/logs.service";
import { logsDto } from "../logs/logs.dto";
import { Between } from "typeorm";
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
      Message: `Exam Submitted  Successfully, student id: ${payload.StudentId}, student name : ${payload.studentName} , student class Id: ${payload.ClassName_Id} , By - `,
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
  const { StudentId, studentName, ClassName_Id, studentusername } = req.body;
  try {
    const logsPayload: logsDto = {
      UserId: Number(StudentId),
      UserName: studentusername,
      statusCode: 200,
      Message: `Try again exam clicked   → StudentId: ${StudentId},Student Name: ${studentName}, Class Id: ${ClassName_Id} by -`,
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
export const getStudentScoreResult = async (req: Request, res: Response) => {
  try {
    const { StudentId, fromDate, toDate } = req.query;

    const repo = appSource.getRepository(studentScoreResult);

    // const result = await appSource.query(
    //   `
    //   SELECT *
    //   FROM [${process.env.DB_NAME}].[dbo].[student_score_result]
    //   WHERE StudentId = '${StudentId}'
    //     AND CONVERT(DATE, created_at) >= '${fromDate}'
    //     AND CONVERT(DATE, created_at) <= '${toDate}'
    //   ORDER BY created_at DESC
    //   `
    // );
    const result = await appSource.query(
      `
SELECT 
  r.StudentId,
  r.TestType,
  r.NumOfQuestion,
  r.NoOfCorrectAnswered,
  r.NoOfWrongAnswered,
  r.Time,
  r.Time_Take,
  r.created_at,
  c.className AS className,
  s.subjectName AS subjectName

FROM [${process.env.DB_NAME}].[dbo].[student_score_result] r

LEFT JOIN [${process.env.DB_NAME}].[dbo].[class_master] c
  ON r.ClassName_Id = c.Class_Id

LEFT JOIN [${process.env.DB_NAME}].[dbo].[subject_master] s
  ON r.subjectName_Id = s.subject_Id

WHERE r.StudentId = '${StudentId}'
ORDER BY r.created_at DESC
`,
      [StudentId]
    );

    return res.status(200).json({
      IsSuccess: true,
      Result: result,
    });
  } catch (error) {
    return res.status(500).json({
      ErrorMessage: "Error fetching student report",
      error: error instanceof Error ? error.message : error,
    });
  }
};
