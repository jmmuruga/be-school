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
    console.log("DB Password:", user.password);
    console.log("Entered Password:", payload.password);
    if (user.password !== payload.password) {
      console.log("Password mismatch ");
      return res.status(401).send({
        ErrorMessage: "Invalid password. Please try again.",
      });
    }
    console.log("Password match ");
    return res.status(200).send({
      IsSuccess: "SignIn Successfully",
      user: {
        id: user.UserID,
        name: user.userName,
        email: user.email,
        role: user.roleType,
      },
    });
  } catch (error: any) {
    console.error("Sign-in error:", error);
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
    console.log("DB Password:", student.password);
    console.log("Entered Password:", payload.Password);
    if (student.password !== payload.Password) {
      console.log("Password mismatch ");
      return res.status(401).send({
        ErrorMessage: "Invalid password. Please try again.",
      });
    }
    console.log("Password match ");
    return res.status(200).send({
      IsSuccess: "SignIn Successfully",
      user: {
        name: student.UserName,
        email: student.email,
      },
    });
  } catch (error: any) {
    console.error("Sign-in error:", error);
    return res.status(500).send({
      ErrorMessage: "Internal Server Error",
    });
  }
};

export const getDetails = async (req: Request, res: Response) => {
  try {
    const registerRepositry = appSource.getRepository(signIn);
    // get the details
    const registerR = await registerRepositry.find();
    res.status(200).send({
      Result: registerR,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Internal server error",
      error: error instanceof Error ? error.message : error,
    });
    // console.log(error);
  }
};
