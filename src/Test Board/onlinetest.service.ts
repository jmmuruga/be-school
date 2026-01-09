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
    // console.log('payload',payload);
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
       WHERE id = '${id}'`
    );

    if (!students || students.length === 0) {
      return res.status(404).json({
        IsSuccess: false,
        ErrorMessage: "Student not found",
      });
    }

    const student = students[0];
    // console.log("Student data:", student);
    return res.status(200).json({
      IsSuccess: true,
      Result: student,
    });
  } catch (error) {
    // console.error(error);
    return res.status(500).json({
      IsSuccess: false,
      ErrorMessage: "Internal server error",
      error: error instanceof Error ? error.message : error,
    });
  }
};
export const getObjectiveQuestions = async (req: Request, res: Response) => {
  try {
    const { subjectName_Id, ClassName_Id, type, question, Stream_Id } =
      req.params;
    // console.log(req.params);
    // console.log("received oneMax ", oneMax);
    const objectiveRepo = appSource.getRepository(objectiveques);

    const questions = await objectiveRepo.query(
      `SELECT TOP ${question} *
        FROM objectiveques
          WHERE subjectName_Id = '${subjectName_Id}'
          AND ClassName_Id = '${ClassName_Id}'
  AND type = '${type}'
  AND Stream_Id = '${Stream_Id}'
  ;`
    );
    return res.status(200).json({
      IsSuccess: "successfully",
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
