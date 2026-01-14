import { appSource } from "../core/database/db";
import { SignInDto, SignInvalidation } from "./sign-in.dto";
import { Request, Response } from "express";
import { SignIn } from "./sign-in.model";
import { User } from "../User-Profile/user.model";
import nodemailer from "nodemailer";
import { Signup } from "../Signup/signup.model";
import { logsDto } from "../logs/logs.dto";
import { InsertLog } from "../logs/logs.service";
import { saveOtpForStudent } from "../Generate_Otp/generate_otp.service";
export const signIn = async (req: Request, res: Response) => {
  const payload = req.body;
  const userRepository = appSource.getRepository(User);
  let user =
    (await userRepository.findOneBy({ email: payload.emailOrPhone })) ||
    (await userRepository.findOneBy({ phone: payload.emailOrPhone }));
  if (!user) {
    return res.status(401).send({
      ErrorMessage: "User does not exist. Please check your username.",
    });
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
    if (student.password !== payload.Password) {
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
       WHERE id = '${id}'`
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
      IsSuccess: false,
      ErrorMessage: "Internal server error",
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
        user: "savedatain@gmail.com",
        pass: "unpk bcsy ibhp wzrm",
      },
    });
    const response = await transporter.sendMail({
      from: "savedatain@gmail.com",
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
      IsSuccess: true,
      Message: "OTP sent successfully to your email",
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
      ErrorMessage: "Internal server error",
      error: error.message,
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
      WHERE studentId = ${studentId}
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
        IsSuccess: false,
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
    return res.status(200).send({
      IsSuccess: true,
      Message: "OTP verified successfully",
    });
  } catch (error: any) {
    return res.status(500).send({
      IsSuccess: false,
      ErrorMessage: "Internal server error",
      error: error.message,
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
    await appSource.query(`
       UPDATE [${process.env.DB_NAME}].[dbo].[signup]
  SET password = '${newPassword}', confirmPassword = '${confirmNewPassword}'
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
      IsSuccess: true,
      Message: "Password reset successfully",
    });
  } catch (error: any) {
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
