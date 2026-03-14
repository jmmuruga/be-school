import { appSource } from "../core/database/db";
import { SignInDto, SignInvalidation } from "./sign-in.dto";
import { Request, Response } from "express";
import { SignIn } from "./sign-in.model";
import { User } from "../User-Profile/user.model";
import nodemailer from "nodemailer";
import jwt from "jsonwebtoken";
import { Signup } from "../Signup/signup.model";
import { logsDto } from "../logs/logs.dto";
import { InsertLog } from "../logs/logs.service";
import { saveOtpForStudent } from "../Generate_Otp/generate_otp.service";
import { decrypter, encryptString } from "../shared/helper";
export const signIn = async (req: Request, res: Response) => {
  const payload = req.body;
  const userRepository = appSource.getRepository(User);
  let user =
    (await userRepository.findOneBy({ email: payload.emailOrPhone })) ||
    (await userRepository.findOneBy({ phone: payload.emailOrPhone }));
  if (!user) {
    return res.status(401).send({
      ErrorMessage: "User does not exist.Please check your username.",
    });
  }
  if (!user.isActive || !user.status) {
    const logsPayload: logsDto = {
      UserId: user.UserID,
      UserName: user.userName,
      statusCode: 500,
      Message: `Login blocked: inactive user - ${user.email} - `,
    };

    await InsertLog(logsPayload);

    return res.status(401).send({
      ErrorMessage: "User is inactive",
    });
  }
 
  try {
    const decryptedPassword = decrypter(user.password);
    if (decryptedPassword !== payload.password) {
      const logsPayload: logsDto = {
        UserId: user.UserID,
        UserName: null,
        statusCode: 500,
        Message: `Login failed: Wrong password for user ${user.email} by -`,
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

    const token = jwt.sign(
      {
        UserID: user.UserID,
        email: user.email,
        phonenumber: user.phone,
        roleType: user.roleType,
      },
      process.env.JWT_SECRET_KEY as string,
    );
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
        token,
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
  const password = payload.password || payload.Password;
  const studentRespository = appSource.getRepository(Signup);
  // let student = await studentRespository.findOneBy({
  //   UserName: payload.usernameOrAdmission,
  // });
  // if (!student) {
  //   student = await studentRespository.findOneBy({
  //     password: payload.usernameOrAdmission,
  //   });
  // }
  let student =
    (await studentRespository.findOneBy({
      UserName: payload.usernameOrAdmission,
    })) ||
    (await studentRespository.findOneBy({
      password: payload.usernameOrAdmission,
    }));
  if (!student) {
    return res.status(401).send({
      ErrorMessage: "Student does not exist. Please check your username.",
    });
  }
  if (student.UserName !== payload.usernameOrAdmission) {
    const logsPayload: logsDto = {
      UserId: student.id,
      UserName: student.UserName,
      statusCode: 500,
      Message: `Signin failed: Student does not exist - ${payload.usernameOrAdmission}`,
    };
    await InsertLog(logsPayload);
    return res.status(401).send({
      ErrorMessage: "Student Does Not Exist ..Please Check your name ",
    });
  }

  try {
    const decryptedPassword = decrypter(student.password);
    if (decryptedPassword !== payload.Password) {
      const logsPayload: logsDto = {
        UserId: student.id,
        UserName: student.UserName,
        statusCode: 500,
        Message: `Login failed: Wrong password for student by- `,
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
    const token = jwt.sign(
      {
        id: student.id,
        username: student.UserName,
        email: student.email,
        standard: student.Class_Id,
      },
      process.env.JWT_SECRET_KEY as string,
    );
    const logsPayload: logsDto = {
      UserId: student.id,
      UserName: student.UserName,
      statusCode: 200,
      Message: `Student session start at ${now} By - `,
    };
    await InsertLog(logsPayload);
    return res.status(200).send({
      IsSuccess: "Sign-in Successfully",
      user: {
        name: student.name,
        username: student.UserName,
        email: student.email,
        studentid: student.id,
        studentschool: student.school,
        standard: student.Class_Id,
        studentStream_Id: student.Stream_Id,
        token,
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
      `SELECT id, name,Class_Id
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
      message: "Internal server error",
      error: error instanceof Error ? error.message : error,
    });
  }
};
export const logout = async (req: Request, res: Response) => {
  const { userId, userName } = req.body;
  try {
    if (!userId) {
      return res.status(400).json({
        IsSuccess: false,
        ErrorMessage: "UserId is required to sign out",
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
      UserId: userId,
      UserName: userName,
      statusCode: 200,
      Message: ` sign-out at ${now} by -  `,
    };

    await InsertLog(logsPayload);

    return res.status(200).json({
      IsSuccess: true,
      Message: "Sign out successfully",
    });
  } catch (error: any) {
    const logsPayload: logsDto = {
      UserId: userId,
      UserName: userName || null,
      statusCode: 200,
      Message: ` Error while User sign out - ${error.message}-`,
    };

    await InsertLog(logsPayload);
    return res.status(500).json({
      message: "Internal server error",
      error: error instanceof Error ? error.message : error,
    });
  }
};

export const forgotPassword = async (req: Request, res: Response) => {
  const payload = req.body;
  try {
    const studentRepository = appSource.getRepository(Signup);

    let student = await studentRepository.findOneBy({
      UserName: payload.usernameOrAdmission,
    });

    const studentname = student.UserName;
    const studentmail = student.email;
    if (!studentmail) {
      return res.status(401).send({
        ErrorMessage: "Student mail doesnt exist.",
      });
    }
    if (!studentname) {
      return res.status(401).send({
        ErrorMessage: "Student Username doesnt exist.",
      });
    }
    const GeneratedOtp = generateOpt();
    await saveOtpForStudent(student.id, Number(GeneratedOtp));

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "scoreplus.2026@gmail.com",
        pass: "tcwy inih kqoa ynsg",
      },
    });
    const response = await transporter.sendMail({
      from: "scoreplus.2026@gmail.com",
      to: studentmail,
      subject: `OTP to Reset Password`,
      text: `
Hello ${studentname},

Your OTP for password reset is: ${GeneratedOtp}

Please use this OTP to reset your password.

Thank you.
      `,
    });

    // Log success
    const logsPayload: logsDto = {
      UserId: student.id,
      UserName: student.UserName,
      statusCode: 200,
      Message: `Student OTP sent successfully -`,
    };
    await InsertLog(logsPayload);

    return res.status(200).send({
      IsSuccess: "OTP sent successfully to your email",
      user: {
        id: student.id,
        name: student.name,
        email: student.email,
        username: student.UserName,
        school: student.school,
        standard: student.Class_Id,
      },
    });
  } catch (error: any) {
    return res.status(500).json({
      message: "Internal server error",
      error: error instanceof Error ? error.message : error,
    });
  }
  function generateOpt(): string {
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    return otp;
  }
};

export const verifyStudentOtp = async (req: Request, res: Response) => {
  const { studentId, otp } = req.body;
  try {
    if (!studentId || !otp) {
      return res.status(400).send({
        IsSuccess: false,
        ErrorMessage: "StudentId and OTP are required",
      });
    }

    const result = await appSource.query(`
      SELECT TOP 1 Generate_Otp
      FROM [${process.env.DB_NAME}].[dbo].[generate_otp]
      WHERE userId = ${studentId}
      ORDER BY id DESC
    `);

    if (result.length === 0) {
      await InsertLog({
        UserId: studentId,
        UserName: null,
        statusCode: 404,
        Message: "OTP not found for student",
      });

      return res.status(404).send({
        IsSuccess: false,
        ErrorMessage: "OTP not found. Please request again.",
      });
    }

    const savedOtp = String(result[0].Generate_Otp);
    if (savedOtp !== String(otp)) {
      const logsPayload: logsDto = {
        UserId: studentId,
        UserName: null,
        statusCode: 401,
        Message: `Invalid OTP attempt for Student - student
        ID : ${studentId} -`,
      };
      await InsertLog(logsPayload);
      return res.status(401).send({
        ErrorMessage: "Invalid OTP. Please try again",
      });
    }
    const logsPayload: logsDto = {
      UserId: studentId,
      UserName: null,
      statusCode: 200,
      Message: `OTP verified successfully for Student - studentID :${studentId} -`,
    };
    await InsertLog(logsPayload);
    res.status(200).send({
      IsSuccess: "OTP verified successfully",
    });
    // Then delete the OTP from DB
    await appSource.query(`
      DELETE FROM [${process.env.DB_NAME}].[dbo].[generate_otp]
      WHERE userId = ${studentId} AND Generate_Otp = '${savedOtp}'
    `);
  } catch (error: any) {
    return res.status(500).json({
      message: "Internal server error",
      error: error instanceof Error ? error.message : error,
    });
  }
};

export const resetStudentPassword = async (req: Request, res: Response) => {
  const { studentId, newPassword, confirmNewPassword } = req.body;
  try {
    if (!studentId || !newPassword) {
      return res.status(400).send({
        IsSuccess: false,
        ErrorMessage: "StudentId and New Password required",
      });
    }
    const encryptedPassword = encryptString(newPassword, "ABCXY123");
    const encryptedConfirmPassword = encryptString(
      confirmNewPassword,
      "ABCXY123",
    );

    await appSource.query(`
       UPDATE [${process.env.DB_NAME}].[dbo].[signup]
       SET password = '${encryptedPassword}', confirmPassword = '${encryptedConfirmPassword}'
       WHERE id = ${studentId}
    `);

    const logsPayload: logsDto = {
      UserId: studentId,
      UserName: null,
      statusCode: 200,
      Message: `Password reset successfully for Student - studentID: ${studentId} -`,
    };
    await InsertLog(logsPayload);

    return res.status(200).send({
      IsSuccess: "Password reset successfully",
    });
  } catch (error) {
    const logsPayload: logsDto = {
      UserId: studentId,
      UserName: null,
      statusCode: 500,
      Message: `Error while student set a new password - ${error.message}`,
    };
    await InsertLog(logsPayload);
    return res.status(500).json({
      message: "Internal server error",
      error: error instanceof Error ? error.message : error,
    });
  }
};

export const userForgotPassword = async (req: Request, res: Response) => {
  const payload = req.body;

  try {
    const userRepository = appSource.getRepository(User);

    const user =
      (await userRepository.findOneBy({ email: payload.emailOrPhone })) ||
      (await userRepository.findOneBy({ phone: payload.emailOrPhone }));

    const email = user.email;
    const phone = user.phone;

    if (!email) {
      return res.status(401).send({
        ErrorMessage: "user mail doesnt exist.",
      });
    }
    if (!phone) {
      return res.status(401).send({
        ErrorMessage: "user Phone doesnt exist.",
      });
    }

    const GeneratedOtp = generateOpt();

    await appSource.query(`
      INSERT INTO [${process.env.DB_NAME}].[dbo].[generate_otp]
      (userId, Generate_Otp)
      VALUES (${user.UserID}, ${GeneratedOtp})
    `);

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "scoreplus.2026@gmail.com",
        pass: "tcwy inih kqoa ynsg",
      },
    });

    await transporter.sendMail({
      from: "scoreplus.2026@gmail.com",
      to: user.email,
      subject: "OTP to Reset Password",
      text: `
Hello ${user.userName},

Your OTP for password reset is: ${GeneratedOtp}

Please use this OTP to reset your password.
      `,
    });

    const logsPayload: logsDto = {
      UserId: user.UserID,
      UserName: user.userName,
      statusCode: 200,
      Message: `user OTP sent successfully -`,
    };
    await InsertLog(logsPayload);
    return res.status(200).send({
      IsSuccess: "OTP sent to registered email",
      userId: user.UserID,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Internal server error",
      error: error instanceof Error ? error.message : error,
    });
  }
};

function generateOpt(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}
export const verifyUserOtp = async (req: Request, res: Response) => {
  const { userId, otp } = req.body;

  try {
    if (!userId || !otp) {
      return res.status(400).send({
        IsSuccess: false,
        ErrorMessage: "userId and OTP are required",
      });
    }
    const result = await appSource.query(`
      SELECT TOP 1 Generate_Otp
      FROM [${process.env.DB_NAME}].[dbo].[generate_otp]
      WHERE userId = ${userId}
      ORDER BY id DESC
    `);

    if (result.length === 0) {
      await InsertLog({
        UserId: userId,
        UserName: null,
        statusCode: 404,
        Message: "OTP not found for user",
      });

      return res.status(404).send({
        IsSuccess: false,
        ErrorMessage: "OTP not found. Please request again.",
      });
    }

    const savedOtp = String(result[0].Generate_Otp);
    if (savedOtp !== String(otp)) {
      const logsPayload: logsDto = {
        UserId: userId,
        UserName: null,
        statusCode: 401,
        Message: `Invalid OTP attempt for user - user
        ID : ${userId} -`,
      };
      await InsertLog(logsPayload);
      return res.status(401).send({
        IsSuccess: false,
        ErrorMessage: "Invalid OTP. Please try again",
      });
    }
    const logsPayload: logsDto = {
      UserId: userId,
      UserName: null,
      statusCode: 200,
      Message: `OTP verified successfully for user - userId :${userId} -`,
    };
    await InsertLog(logsPayload);
    res.status(200).send({
      IsSuccess: "OTP verified successfully.",
    });

    // Then delete the OTP from DB
    await appSource.query(`
      DELETE FROM [${process.env.DB_NAME}].[dbo].[generate_otp]
      WHERE userId = ${userId} AND Generate_Otp = '${savedOtp}'
    `);
  } catch (error: any) {
    return res.status(500).json({
      message: "Internal server error",
      error: error instanceof Error ? error.message : "Internal server error",
    });
  }
};
export const resetUserPassword = async (req: Request, res: Response) => {
  const { userId, newPassword, confirmNewPassword } = req.body;

  try {
    if (newPassword !== confirmNewPassword) {
      return res.status(400).send({
        ErrorMessage: "Passwords do not match",
      });
    }
    const encryptedPassword = encryptString(newPassword, "ABCXY123");
    const encryptedConfirmPassword = encryptString(
      confirmNewPassword,
      "ABCXY123",
    );

    // Update both password and confirmPassword
    await appSource.query(`
      UPDATE [${process.env.DB_NAME}].[dbo].[user]
      SET password = '${encryptedPassword}', confirmPassword = '${encryptedConfirmPassword}'
      WHERE UserID = ${userId}
    `);
    const logsPayload: logsDto = {
      UserId: userId,
      UserName: null,
      statusCode: 200,
      Message: `Password reset successfully for Student - userId: ${userId} -`,
    };
    await InsertLog(logsPayload);

    return res.status(200).send({
      IsSuccess: "Password reset Successfully",
    });
  } catch (error) {
    const logsPayload: logsDto = {
      UserId: userId,
      UserName: null,
      statusCode: 500,
      Message: `Error while student set a new password - ${error.message}`,
    };
    await InsertLog(logsPayload);
    return res.status(500).json({
      message: "Internal server error",
      error: error instanceof Error ? error.message : String(error),
    });
  }
};
