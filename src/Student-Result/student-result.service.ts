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
    const { StudentId, reportType, subjectId, fromDate, toDate } = req.query;

    let query = "";
    if (reportType === "last_test") {
      query = `
    SELECT TOP 1
      created_at,
      subjectName_Id,
      NumOfQuestion,
      NoOfCorrectAnswered,
      NoOfWrongAnswered
    FROM [${process.env.DB_NAME}].[dbo].[student_score_result]
    WHERE StudentId = '${StudentId}'
    ORDER BY created_at DESC
  `;
    } else if (reportType === "subject_wise") {
      query = `
    SELECT
      created_at,
      subjectName_Id,
      NumOfQuestion,
      NoOfCorrectAnswered,
      NoOfWrongAnswered
    FROM [${process.env.DB_NAME}].[dbo].[student_score_result]
    WHERE StudentId = '${StudentId}'
      AND subjectName_Id = '${subjectId}'
    ORDER BY created_at DESC
  `;
    } else if (reportType === "date_wise") {
      query = `
    SELECT
      created_at,
      subjectName_Id,
      NumOfQuestion,
      NoOfCorrectAnswered,
      NoOfWrongAnswered
    FROM [${process.env.DB_NAME}].[dbo].[student_score_result]
    WHERE StudentId = '${StudentId}'
      AND CONVERT(DATE, created_at) >= '${fromDate}'
      AND CONVERT(DATE, created_at) <= '${toDate}'
    ORDER BY created_at DESC
  `;
    } else {
      return res.status(400).json({
        ErrorMessage: "Invalid report type",
      });
    }

    const result = await appSource.query(query);
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
export const getstudentResultCount = async (req: Request, res: Response) => {
  try {
    const { StudentId } = req.query;

    if (!StudentId) {
      return res.status(400).json({
        ErrorMessage: "StudentId is required",
      });
    }

    const query = `
      SELECT COUNT(*) AS AttemptCount
      FROM [${process.env.DB_NAME}].[dbo].[student_score_result]
      WHERE StudentId = '${StudentId}'
    `;

    const result = await appSource.query(query);

    return res.status(200).json({
      IsSuccess: true,
      StudentId,
      AttemptCount: result[0]?.AttemptCount || 0,
    });
  } catch (error) {
    return res.status(500).json({
      ErrorMessage: "Error fetching student result count",
      error: error instanceof Error ? error.message : error,
    });
  }
};
export const getSubjectNameCount = async (req: Request, res: Response) => {
  try {
    const query = `
      SELECT
        sm.subjectName AS Subject,
        COUNT(ssr.subjectName_Id) AS SubjectCount
      FROM [${process.env.DB_NAME}].[dbo].[student_score_result] ssr
      INNER JOIN [${process.env.DB_NAME}].[dbo].[subject_master] sm
        ON sm.subject_Id = ssr.subjectName_Id
      GROUP BY sm.subjectName
      ORDER BY SubjectCount DESC
    `;

    const result = await appSource.query(query);

    return res.status(200).json({
      IsSuccess: true,
      Result: result,
    });
  } catch (error) {
    return res.status(500).json({
      ErrorMessage: "Error fetching subject count",
      error: error instanceof Error ? error.message : error,
    });
  }
};


