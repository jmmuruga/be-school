import { appSource } from "../core/database/db";
import { Request, Response } from "express";
import { onlinetest } from "./onlinetest.model";
import { Signup } from "../Signup/signup.model";
import { SignInDto
 } from "../sign-in/sign-in.dto";
 import { SignupValidation } from "../Signup/signup.dto";
import { onlinetestDto, OnlineTestValidation } from "./onlinetest.dto";
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
