import { appSource } from "../core/database/db";
import { Request, Response } from "express";
import { onlinetest } from "./onlinetest.model";
import { onlinetestDto, OnlineTestValidation } from "./onlinetest.dto";
import { objectiveques } from "../Question bank/objective-question/objective-question.model";
import { InsertLog } from "../logs/logs.service";
import { logsDto } from "../logs/logs.dto";
export const addOnlinetest = async (req: Request, res: Response) => {
  const payload: onlinetestDto = req.body;
  try {
    const validation = OnlineTestValidation.validate(payload);
    if (validation.error) {
      const logsPayload: logsDto = {
        UserId: Number(payload.created_UserId),
        UserName: payload.studentusername,
        statusCode: 500,
        Message: `Validation error: ${validation.error.details[0].message} -`,
      };
      await InsertLog(logsPayload);
      return res.status(400).json({
        message: validation.error.details[0].message,
      });
    }
    const onlinetestRepoistry = appSource.getRepository(onlinetest);
    await onlinetestRepoistry.save(payload);
    const logsPayload: logsDto = {
      UserId: Number(payload.created_UserId),
      UserName: payload.studentusername,
      statusCode: 200,
      Message: `Exam Started Successfully, student id: ${payload.created_UserId}, student name : ${payload.studentName} , student class: ${payload.studentStandard} , By - `,
    };
    await InsertLog(logsPayload);
    return res.status(200).json({ IsSuccess: "Start successfully" });
  } catch (error) {
    const logsPayload: logsDto = {
      UserId: Number(payload.created_UserId),
      UserName: payload.studentusername,
      statusCode: 500,
      Message: `Error while start exam - ${error.message} -`,
    };
    await InsertLog(logsPayload);
    return res.status(500).json({
      message: "Internal server error",
      error: error instanceof Error ? error.message : error,
    });
  }
};
export const getStudentId = async (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    const students = await appSource.query(
      `SELECT id, name,ClassName_Id
       FROM [${process.env.DB_NAME}].[dbo].[signup]
       WHERE id = '${id}'`,
    );

    if (!students || students.length === 0) {
      return res.status(404).json({
        IsSuccess: false,
        ErrorMessage: "Student not found",
      });
    }

    const student = students[0];
    return res.status(200).json({
      IsSuccess: true,
      Result: student,
    });
  } catch (error) {
    return res.status(500).json({
      IsSuccess: false,
      ErrorMessage: "Internal server error",
      error: error instanceof Error ? error.message : error,
    });
  }
};
export const getObjectiveQuestions = async (req: Request, res: Response) => {
  try {
    const {
      subjectName_Id,
      ClassName_Id,
      type,
      question,
      Stream_Id,
      studentId,
      mode
    } = req.params;

    let questions;
    if (mode === 'reattempt') {
  questions = await appSource.query(`
    SELECT q.*
    FROM [${process.env.DB_NAME}].[dbo].[objectiveques] q
    INNER JOIN (
        SELECT Question_Id, subjectName_Id, ClassName_Id, TestType
        FROM [${process.env.DB_NAME}].[dbo].[studentexam_report]
        WHERE StudentId = '${studentId}'
          AND subjectName_Id = '${subjectName_Id}'
          AND ClassName_Id = '${ClassName_Id}'
          AND TestType = '${type}'
          AND Test_No = (
              SELECT TOP 1 Test_No
              FROM [${process.env.DB_NAME}].[dbo].[studentexam_report]
              WHERE StudentId = '${studentId}'
                AND subjectName_Id = '${subjectName_Id}'
                AND ClassName_Id = '${ClassName_Id}'
                AND TestType = '${type}'
              ORDER BY Test_No DESC
          )
    ) r
      ON CAST(q.Question_Id AS INT) = CAST(r.Question_Id AS INT)
     AND q.subjectName_Id = r.subjectName_Id
     AND q.ClassName_Id = r.ClassName_Id
     AND q.type = r.TestType
     AND q.Stream_Id = '${Stream_Id}'

    ORDER BY CAST(q.Question_Id AS INT) ASC
`);
    } else if (mode === 'new') {
      const lastAttempt = await appSource.query(`
        SELECT MAX(CAST(Question_Id AS INT)) as LastQuestionId
        FROM [${process.env.DB_NAME}].[dbo].[studentexam_report]
        WHERE StudentId = '${studentId}'
          AND subjectName_Id = '${subjectName_Id}'
          AND ClassName_Id = '${ClassName_Id}'
          AND TestType = '${type}'
      `);
      const lastQuestionId = lastAttempt[0]?.LastQuestionId || 0;
      }else
      {
       questions = await appSource.query(`
      SELECT TOP (${question}) q.*
      FROM [${process.env.DB_NAME}].[dbo].[objectiveques] q
      WHERE q.subjectName_Id = '${subjectName_Id}'
        AND q.ClassName_Id = '${ClassName_Id}'
        AND q.type = '${type}'
        AND q.Stream_Id = '${Stream_Id}'
        AND NOT EXISTS (
          SELECT 1
          FROM [${process.env.DB_NAME}].[dbo].[studentexam_report] r
          WHERE r.Question_Id = q.Question_Id
            AND r.StudentId = '${studentId}'
            AND r.subjectName_Id = '${subjectName_Id}'
            AND r.ClassName_Id = '${ClassName_Id}'
            AND r.TestType = '${type}'
        )
      ORDER BY CAST(q.Question_Id AS INT) ASC
    `);

       }
    if (!questions || questions.length === 0) {
      return res.status(404).json({
        IsSuccess: false,
        ErrorMessage: "No more new questions available",
      });
    }

    return res.status(200).json({
      IsSuccess: "Start the Exam !! All the Best ",
      Result: questions,
    });

  } catch (error) {
    return res.status(500).json({
      IsSuccess: false,
      ErrorMessage: "Internal server error",
      error: error instanceof Error ? error.message : error
    });
  }
};
