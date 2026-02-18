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
    } = req.params;

    // Fetch questions excluding ones the student has already attempted
    const questions = await appSource.query(`
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

    if (!questions || questions.length === 0) {
      return res.status(404).json({
        IsSuccess: false,
        ErrorMessage: "No more questions available for this student",
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
      error: error instanceof Error ? error.message : error,
    });
  }
};
//         FROM [${process.env.DB_NAME}].[dbo].[objectiveques]
//           WHERE subjectName_Id = '${subjectName_Id}'
//           AND ClassName_Id = '${ClassName_Id}'
//   AND type = '${type}'
//   AND Stream_Id = '${Stream_Id}'
//   ;`,
//     );
//     return res.status(200).json({
//       IsSuccess: "successfully",
//       Result: questions,
//     });
//   } catch (error) {
//     return res.status(500).json({
//       IsSuccess: false,
//       ErrorMessage: "Internal server error",
//       error: error instanceof Error ? error.message : error,
//     });
//   }
// };
// export const getObjectiveQuestions = async (req: Request, res: Response) => {
//   try {
//     const { subjectName_Id, ClassName_Id, type, question, Stream_Id, studentId } =
//       req.params;

//     // 1️⃣ Find how many tests student already attended
//     const testResult = await appSource.query(
//       `SELECT ISNULL(MAX(Test_No),0) AS TestNo
//        FROM [${process.env.DB_NAME}].[dbo].[studentexam_report]
//        WHERE StudentId='${studentId}'
//          AND subjectName_Id='${subjectName_Id}'
//          AND TestType='${type}'`
//     );

//     const testNo = Number(testResult[0].TestNo);
//     const offset = testNo * Number(question);

//     // 2️⃣ Fetch next set of questions
//     const questions = await appSource.query(
//       `SELECT *
//        FROM [${process.env.DB_NAME}].[dbo].[objectiveques]
//        WHERE subjectName_Id='${subjectName_Id}'
//          AND ClassName_Id='${ClassName_Id}'
//          AND type='${type}'
//          AND Stream_Id='${Stream_Id}'
//        ORDER BY Question_Id
//        OFFSET ${offset} ROWS
//        FETCH NEXT ${question} ROWS ONLY`
//     );

//     return res.status(200).json({
//       IsSuccess: true,
//       Result: questions,
//     });

//   } catch (error) {
//     return res.status(500).json({
//       IsSuccess: false,
//       ErrorMessage: "Internal server error",
//       error: error instanceof Error ? error.message : error,
//     });
//   }
// }