import { appSource } from "../core/database/db";
import { SignInDto, SignInvalidation } from "./sign-in.dto";
import { Request, Response } from "express";
import { SignIn } from "./sign-in.model";
import { User } from "../User-Profile/user.model";
import { createTestAccount } from "nodemailer";
import { Signup } from "../Signup/signup.model";
export const signIn = async (req: Request, res: Response) => {
  const payload = req.body;
  const userRepository = appSource.getRepository(User);
  let user = await userRepository.findOneBy({ email: payload.emailOrPhone });
  if (!user) {
    user = await userRepository.findOneBy({ phone: payload.emailOrPhone });
  }
  if (!user) {
    return res.status(401).send({
      ErrorMessage: "user Does Not Exist",
    });
  }
  try {
    if (user.password !== payload.password) {
      return res.status(401).send({
        ErrorMessage: "Invalid password. Please try again.",
      });
    }
    return res.status(200).send({
      IsSuccess: "SignIn Successfully",
      user: {
        id: user.UserID,
        name: user.userName,
        email: user.email,
        roleType: user.roleType,
        phone:user.phone,
        staffNo:user.staffNo,
         password:user.password

      },
    });
  } catch (error: any) {
    return res.status(500).send({
      ErrorMessage: "Internal Server Error",
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
    return res.status(401).send({
      ErrorMessage: "Student Does Not Exist",
    });
  }
  try {
    if (student.password !== payload.Password) {
      return res.status(401).send({
        ErrorMessage: "Invalid password. Please try again.",
      });
    }
    // console.log('Student School from DB:', student.school);
    return res.status(200).send({
      IsSuccess: "Sign-in Successfully",
      user: {
        name: student.UserName,
        email: student.email,
        studentid:student.id,
        studentschool:student.school,
        standard:student.standard
 
      },
    });
    
  } catch (error: any) {
    return res.status(500).send({
      ErrorMessage: "Internal Server Error",
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
    // console.error(error);
    return res.status(500).json({
      IsSuccess: false,
      ErrorMessage: "Internal server error",
      error: error instanceof Error ? error.message : error,
    });
  }
};