import { appSource } from "../core/database/db";
import { SignupDto, SignupValidation } from "./signup.dto";
import { Request, Response } from "express";
import { Signup } from "./signup.model";
import { InsertLog } from "../logs/logs.service";
import { logsDto } from "../logs/logs.dto";
export const addSignup = async (req: Request, res: Response) => {
  try {
    const payload: SignupDto = req.body;
    const validation = SignupValidation.validate(payload);
    if (validation.error) {
      const logsPayload: logsDto = {
        UserId: 1,
        UserName: null,
        statusCode: 500,
        Message: `Validation error: ${validation.error.details[0].message}`,
      };
      await InsertLog(logsPayload);
      return res.status(400).json({
        message: validation.error.details[0].message,
      });
    }
    // check when existing data

    const signupRepository = appSource.getRepository(Signup);
    const nameExist = await signupRepository.findOneBy({
      UserName: payload.UserName,
    });
    if (nameExist) {
      return res.status(400).json({
        ErrorMessage: "UserName Already Existing",
      });
    }
    const emailExist = await signupRepository.findOneBy({
      email: payload.email,
    });
    if (emailExist) {
      return res.status(400).json({
        ErrorMessage: "Email Already Existing",
      });
    }
    const aatharExist = await signupRepository.findOneBy({
      aadhaar: payload.aadhaar,
    });
    if (aatharExist) {
      return res.status(400).json({
        ErrorMessage: "Aathar No Is Already Exist !! Please Try Another Way !",
      });
    }
    const contactExist = await signupRepository.findOneBy({
      contact: payload.contact,
    });
    if (contactExist) {
      return res.status(400).json({
        ErrorMessage: "Contact No Already Exist !! Please Another No",
      });
    }
    await signupRepository.save(payload);
    const logsPayload: logsDto = {
      UserId: 1,
      UserName: null,
      statusCode: 200,
      Message: `Student Register Successfully By - `,
    };
    await InsertLog(logsPayload);

    return res.status(200).json({ IsSuccess: "Student Register Successfully" });
  } catch (error) {
    return res.status(500).json({
      message: "Internal server error",
      error: error instanceof Error ? error.message : error,
    });
  }
};
export const getDetails = async (req: Request, res: Response) => {
  try {
    const registerRepositry = appSource.getRepository(Signup);
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
  }
};
export const getStudentCount = async (req: Request, res: Response) => {
  try {
    const result = await appSource.query(`
      SELECT COUNT(*) AS total
      FROM [${process.env.DB_NAME}].[dbo].[signup]
    `);

    return res.status(200).json({
      Result: {
        total: Number(result[0].total),
      },
    });
  } catch (error) {
    return res.status(500).json({
      ErrorMessage: "Internal server error",
    });
  }
};

// export const getTenthCount = async (req: Request, res: Response) => {
//   try {
//     const result = await appSource.query(`
//       SELECT COUNT(*) AS tenthCount
//       FROM  [${process.env.DB_NAME}].[dbo].[signup]
//       WHERE Class_Id = 12
//     `);

//     return res.status(200).json({
//       count: Number(result[0].tenthCount),
//     });
//   } catch (error) {
//     return res.status(500).json({
//       message: "Internal server error",
//       error: error instanceof Error ? error.message : error,
//     });
//   }
// };
// export const gettwelvethCount = async (req: Request, res: Response) => {
//   try {
//     const signupRepository = appSource.getRepository(Signup);

//     const twelvethCount = await signupRepository.countBy({
//       Class_Id: "14",
//     });

//     return res.status(200).json({
//       count: twelvethCount,
//     });
//   } catch (error) {
//     return res.status(500).json({
//       message: "Internal server error",
//       error: error instanceof Error ? error.message : error,
//     });
//   }
// }
// export const getStreamCount = async (req: Request, res: Response) => {
//   try {
//     const signupRepository = appSource.getRepository(Signup);
//     const streamCount = await signupRepository.countBy({
//       Stream_Id: "",

//     });
//     return res.status(200).json({
//       count: streamCount,
//     });
//     }
//     catch (error) {
//       return res.status(500).json({
//         message: "Internal server error",
//         error: error instanceof Error ? error.message : error,
//       });
//     }
//   };

// export const getotherStreamCount = async (req: Request, res: Response) => {
//   try {
//     const signupRepository = appSource.getRepository(Signup);

//     const otherStreamCount = await signupRepository.countBy({
//       otherStream: "Yes",
//     });

//     return res.status(200).json({
//       count: otherStreamCount,
//     });
//   } catch (error) {
//     return res.status(500).json({
//       message: "Internal server error",
//       error: error instanceof Error ? error.message : error,
//     });
//   }
// }
