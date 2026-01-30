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
export const getXandXIIClassCount = async (req: Request, res: Response) => {
  try {
    const result = await appSource.query(`
      SELECT 
        cm.className AS Class,
        COUNT(s.Id) AS studCount
      FROM [${process.env.DB_NAME}].[dbo].[signup] s
      INNER JOIN [${process.env.DB_NAME}].[dbo].[class_master] cm
        ON cm.Class_Id = s.Class_Id
      WHERE cm.className IN ('X', 'XII')
      GROUP BY cm.className
      ORDER BY 
        CASE cm.className
          WHEN 'X' THEN 1
          WHEN 'XII' THEN 2
        END
    `);

    return res.status(200).json({
      data: result,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Internal server error",
      error: error instanceof Error ? error.message : error,
    });
  }
};

export const getStreamCount = async (req: Request, res: Response) => {
  try {
    const data = await appSource.query(`
      SELECT 
        result.Stream,
        COUNT(*) AS studCount
      FROM (
        SELECT 
          sm.Stream AS Stream
        FROM [${process.env.DB_NAME}].[dbo].[signup] s
        INNER JOIN [${process.env.DB_NAME}].[dbo].[stream_master] sm
          ON sm.Stream_Id = CAST(s.Stream_Id AS INT)
        WHERE ISNUMERIC(s.Stream_Id) = 1

        UNION ALL
        SELECT 
          'Others' AS Stream
        FROM [${process.env.DB_NAME}].[dbo].[signup]
        WHERE Stream_Id = 'Other'
      ) AS result
      GROUP BY result.Stream
      ORDER BY 
        CASE result.Stream
          WHEN 'Tamil' THEN 1
          WHEN 'English' THEN 2
          WHEN 'Others' THEN 3
          ELSE 4
        END
    `);

    return res.status(200).json({ data });
  } catch (error) {
    return res.status(500).json({
      message: "Internal server error",
      error: error instanceof Error ? error.message : error,
    });
  }
};
