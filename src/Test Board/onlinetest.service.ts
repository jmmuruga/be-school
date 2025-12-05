import { appSource } from "../core/database/db";
import { Request, Response } from "express";
import { onlinetest } from "./onlinetest.model";
import { onlinetestDto, OnlineTestValidation } from "./onlinetest.dto";
import { objectiveques } from "../Question bank/objective-question/objective-question.model";
export const addOnlinetest = async (req: Request, res: Response) => {
  try {
    const payload: onlinetestDto = req.body;
    const validation = OnlineTestValidation.validate(payload);
    if (validation.error) {
      return res.status(400).json({
        message: validation.error.details[0].message,
      });
    }
    const onlinetestRepoistry = appSource.getRepository(onlinetest);
    console.log('payload',payload);
    await onlinetestRepoistry.save(payload);
    return res.status(200).json({ IsSuccess: "Start successfully" });
  } catch (error) {
    console.log(error);
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
      `SELECT id, name,standard
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
   console.log('Student data:', student);
    return res.status(200).json({
      IsSuccess: true,
      Result: student,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      IsSuccess: false,
      ErrorMessage: "Internal server error",
      error: error instanceof Error ? error.message : error,
    });
  }
};
export const getObjectiveQuestions = async (req: Request, res: Response) => {
  try {
    const { subject, standard, type, question } = req.params;
    console.log(req.params);
    // console.log("received oneMax ", oneMax);
    const objectiveRepo = appSource.getRepository(objectiveques);

    const questions = await objectiveRepo.query(
      `SELECT TOP ${question} *
        FROM objectiveques
WHERE subject = '${subject}'
  AND standard = '${standard}'
  AND type = '${type}'
  ;`
    );
    return res.status(200).json({
      IsSuccess: "successfully",
      Result: questions,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Something went wrong" });
  }
};
