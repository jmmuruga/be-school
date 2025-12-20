import { appSource } from "../core/database/db";
import { SignInDto, SignInvalidation } from "./sign-in.dto";
import { Request, Response } from "express";
import { SignIn } from "./sign-in.model";
import { User } from "../User-Profile/user.model";
import { createTestAccount } from "nodemailer";
import { Signup } from "../Signup/signup.model";
import { logsDto } from "../logs/logs.dto";
import { InsertLog } from "../logs/logs.service";
export const signIn = async (req: Request, res: Response) => {
  const payload = req.body;
  const userRepository = appSource.getRepository(User);
  let user = await userRepository.findOneBy({ email: payload.emailOrPhone });
  if (!user) {
    user = await userRepository.findOneBy({ phone: payload.emailOrPhone });
  }
  if (!user) {
    const logsPayload: logsDto = {
      UserId: user.UserID,
      UserName: null,
      statusCode: 500,
      Message: `Login failed: User does not exist - ${payload.emailOrPhone} by-`,
    };
    await InsertLog(logsPayload);
    return res.status(401).send({
      ErrorMessage: "user Does Not Exist",
    });
  }
  try {
    if (user.password !== payload.password) {
      const logsPayload: logsDto = {
        UserId: user.UserID,
        UserName: null,
        statusCode: 500,
        Message: `Login failed:F Wrong password for user ${user.email} by -`,
      };
      await InsertLog(logsPayload);
      return res.status(401).send({
        ErrorMessage: "Invalid password. Please try again.",
      });
    }
    const now = new Date().toLocaleTimeString("en-US", {
      weekday: "short",
      year: "numeric",
      month: "short",
      day: "2-digit",
      hour: "numeric",
      minute: "2-digit",
      second: "2-digit",
      hour12: true,
    });

    const logsPayload: logsDto = {
      UserId: user.UserID,
      UserName: null,
      statusCode: 200,
      Message: `Admin or User session Start at ${now} By - `,
    };
    await InsertLog(logsPayload);

    return res.status(200).send({
      IsSuccess: "Sign-In Successfully",
      user: {
        id: user.UserID,
        name: user.userName,
        email: user.email,
        roleType: user.roleType,
        phone: user.phone,
        staffNo: user.staffNo,
        password: user.password,
      },
    });
  } catch (error: any) {
    const logsPayload: logsDto = {
      UserId: user.UserID,
      UserName: null,
      statusCode: 500,
      Message: `Error while session start - ${error.message}`,
    };
    await InsertLog(logsPayload);
    return res.status(500).json({
      message: "Internal server error",
      error: error instanceof Error ? error.message : error,
    });
  }
};
export const StudentSignIn = async (req: Request, res: Response) => {
  const payload = req.body;
  const studentRespository = appSource.getRepository(Signup);
  let student = await studentRespository.findOneBy({
    UserName: payload.usernameOrAdmission,
  });
  if (!student) {
    student = await studentRespository.findOneBy({
      password: payload.usernameOrAdmission,
    });
  }
  if (!student) {
    const logsPayload: logsDto = {
      UserId: student.id,
      UserName: student.UserName,
      statusCode: 500,
      Message: `Login failed: Student does not exist - ${payload.usernameOrAdmission}`,
    };
    await InsertLog(logsPayload);
    return res.status(401).send({
      ErrorMessage: "Student Does Not Exist",
    });
  }
  try {
    if (student.password !== payload.Password) {
      const logsPayload: logsDto = {
        UserId: student.id,
        UserName: student.UserName,
        statusCode: 500,
        Message: `Login failed: Wrong password for student by-`,
      };
      await InsertLog(logsPayload);
      return res.status(401).send({
        ErrorMessage: "Invalid password. Please try again.",
      });
    }
    const now = new Date().toLocaleTimeString("en-US", {
      weekday: "short",
      year: "numeric",
      month: "short",
      day: "2-digit",
      hour: "numeric",
      minute: "2-digit",
      second: "2-digit",
      hour12: true,
    });
    const logsPayload: logsDto = {
      UserId: student.id,
      UserName: student.UserName,
      statusCode: 200,
      Message: `Student session start at ${now} By - `,
    };
    await InsertLog(logsPayload);
    // console.log('Student School from DB:', student.school);
    return res.status(200).send({
      IsSuccess: "Sign-in Successfully",
      user: {
        name: student.UserName,
        email: student.email,
        studentid: student.id,
        studentschool: student.school,
        standard: student.standard,
      },
    });
  } catch (error: any) {
    const logsPayload: logsDto = {
      UserId: student.id,
      UserName: student.UserName,
      statusCode: 500,
      Message: `Error while session start - ${error.message} by  student- `,
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
    //  console.log('Student data:', student);

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
