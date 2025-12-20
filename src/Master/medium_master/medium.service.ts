import { appSource } from "../../core/database/db";
import { MediumDto, mediumStatus, MediumValidation } from "./medium.dto";
import { Request, Response } from "express";
import { MediumMaster } from "./medium.model";
import mediumRouter from "./medium.controller";
import { Not } from "typeorm";
import { InsertLog } from "../../logs/logs.service";
import { logsDto } from "../../logs/logs.dto";

export const addMedium = async (req: Request, res: Response) => {
  const payload: MediumDto = req.body;
  try {
    //check validation
    const validation = MediumValidation.validate(payload);
    if (validation.error) {
      const logsPayload: logsDto = {
        UserId: Number(payload.created_UserId),
        UserName: null,
        statusCode: 500,
        Message: `Validation error: ${validation.error.details[0].message}`,
      };
      await InsertLog(logsPayload);
      return res.status(400).json({
        message: validation.error.details[0].message,
      });
    }
    const mediumRepoistry = appSource.getRepository(MediumMaster);
    const existingMedium = await mediumRepoistry.findOneBy({
      medium: payload.medium,
    });

    if (existingMedium) {
      const logsPayload: logsDto = {
        UserId: Number(payload.created_UserId),
        UserName: null,
        statusCode: 500,
        Message: `Error while saving Medium - ${payload.medium} (Medium already exists) -`,
      };
      await InsertLog(logsPayload);
      return res.status(400).json({
        ErrorMessage: "Medium already exists",
      });
    }
    await mediumRepoistry.save(payload);

    const logsPayload: logsDto = {
      UserId: Number(payload.created_UserId),
      UserName: null,
      statusCode: 200,
      Message: `Added MediumMaster - Medium (${payload.medium})  Successfully By - `,
    };
    await InsertLog(logsPayload);
    return res.status(200).json({ IsSuccess: "Medium Added Successfully !!" });
  } catch (error) {
    const logsPayload: logsDto = {
      UserId: Number(payload.created_UserId),
      UserName: null,
      statusCode: 500,
      Message: `Error while adding  Medium  - ${error.message}`,
    };
    await InsertLog(logsPayload);
    return res.status(500).json({
      message: "Internal server error",
      error: error instanceof Error ? error.message : error,
    });
  }
};
export const getMediumCode = async (req: Request, res: Response) => {
  try {
    const mediumRepositry = appSource.getRepository(MediumMaster);
    let mediumCode = await mediumRepositry.query(
      `SELECT mediumCode
            FROM [${process.env.DB_NAME}].[dbo].[medium_master] 
            Group by mediumCode
            ORDER BY CAST(mediumCode AS INT) DESC;`
    );
    let id = "0";
    if (mediumCode?.length > 0) {
      id = mediumCode[0].mediumCode;
    }
    const finalRes = Number(id) + 1;
    res.status(200).send({
      Result: finalRes,
    });
  } catch (error) {
    // console.log(error);
    return res.status(500).json({
      message: "Internal server error",
      error: error instanceof Error ? error.message : error,
    });
  }
};
export const getMediumDetails = async (req: Request, res: Response) => {
  try {
    const mediumRepoistry = appSource.getRepository(MediumMaster);
    const mediumM = await mediumRepoistry.find({
      where: { isActive: true },
    });
    // const mediumM = await mediumRepoistry.createQueryBuilder("").getMany();
    res.status(200).send({
      Result: mediumM,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Internal server error",
      error: error instanceof Error ? error.message : error,
    });
  }
};
export const updateMedium = async (req: Request, res: Response) => {
  const payload: MediumDto = req.body;
  try {
    //check validation
    const validation = MediumValidation.validate(payload);
    if (validation.error) {
      const logsPayload: logsDto = {
        UserId: Number(payload.created_UserId),
        UserName: null,
        statusCode: 500,
        Message: `Validation error: ${validation.error.details[0].message}`,
      };
      await InsertLog(logsPayload);
      return res.status(400).json({
        message: validation.error.details[0].message,
      });
    }
    // check whether medium exist code

    const mediumRepoistry = appSource.getRepository(MediumMaster);
    const existingMedium = await mediumRepoistry.findOneBy({
      mediumCode: payload.mediumCode,
    });
    if (!existingMedium) {
      const logsPayload: logsDto = {
        UserId: Number(payload.created_UserId),
        UserName: null,
        statusCode: 404,
        Message: `Update Medium Failed - MediumCode ${payload.mediumCode} not found`,
      };
      await InsertLog(logsPayload);
      return res.status(400).json({
        ErrorMessage: "Medium Doesn't exist",
      });
    }
    // check medium  already exists
    const mediumExist = await mediumRepoistry.findBy({
      medium: payload.medium,
      mediumCode: Not(payload.mediumCode),
    });
    if (mediumExist.length > 0) {
      const logsPayload: logsDto = {
        UserId: Number(payload.created_UserId),
        UserName: null,
        statusCode: 500,
        Message: `Error while update medium - ${payload.medium} (medium Name already exists) -`,
      };
      await InsertLog(logsPayload);
      return res.status(400).json({
        ErrorMessage: "Medium Already Exist",
      });
    }
    await mediumRepoistry.update({ mediumCode: payload.mediumCode }, payload);

    const logsPayload: logsDto = {
      UserId: Number(payload.created_UserId),
      UserName: null,
      statusCode: 200,
      Message: `Updated Medium Master - mediumCode : ${existingMedium.mediumCode}, old mediumname :${existingMedium.medium} to new medium :${payload.medium} Successfully By - `,
    };
    await InsertLog(logsPayload);

    return res
      .status(200)
      .json({ IsSuccess: "Medium Updated Successfully !!" });
  } catch (error) {
    const logsPayload: logsDto = {
      UserId: Number(payload.created_UserId),
      UserName: null,
      statusCode: 500,
      Message: `Error while  update Medium  - ${error.message}`,
    };
    await InsertLog(logsPayload);
    return res.status(500).json({
      message: "Internal server error",
      error: error instanceof Error ? error.message : error,
    });
  }
};
export const deleteMedium = async (req: Request, res: Response) => {
  const mediumCode = Number(req.params.mediumCode);
  const { loginUserId, loginUserName } = req.body;
  try {
    if (isNaN(mediumCode)) {
      const logsPayload: logsDto = {
        UserId: loginUserId,
        UserName: loginUserName,
        statusCode: 500,
        Message: `Validation error: Invalid Medium Code (${req.params.mediumCode})`,
      };
      await InsertLog(logsPayload);
      return res.status(400).json({
        ErrorMessage: "Invalid class code",
      });
    }
    const mediumRepoistry = appSource.getRepository(MediumMaster);
    // Check whether mediumcode exists
    const existingMedium = await mediumRepoistry.findOneBy({
      mediumCode: mediumCode,
    });
    if (!existingMedium) {
      const logsPayload: logsDto = {
        UserId: loginUserId,
        UserName: loginUserName,
        statusCode: 404,
        Message: ` Medium Failed - MediumCode ${mediumCode} not found`,
      };
      await InsertLog(logsPayload);

      return res.status(400).json({
        ErrorMessage: "mediumCode  not found",
      });
    }
    //delete and active
    await mediumRepoistry
      .createQueryBuilder()
      .update(MediumMaster)
      .set({ isActive: false })
      .where({ mediumCode: mediumCode })
      .execute();

    const logsPayload: logsDto = {
      UserId: loginUserId,
      UserName: loginUserName,
      statusCode: 200,
      Message: `Deleted Successfully in  Medium Master medium( ${existingMedium.medium}) By - `,
    };
    await InsertLog(logsPayload);
    return res.status(200).json({
      IsSuccess: "Medium Deleted successfully !!",
    });
  } catch (error) {
    const logsPayload: logsDto = {
      UserId: loginUserId,
      UserName: loginUserName,
      statusCode: 500,
      Message: `Error while delete Medium  - ${error.message}`,
    };
    await InsertLog(logsPayload);
    return res.status(500).json({
      message: "Internal server error",
      error: error instanceof Error ? error.message : error,
    });
  }
};
export const updateMediumStatus = async (req: Request, res: Response) => {
  const payload: mediumStatus = req.body;
  try {
    const mediumRepoistry = appSource.getRepository(MediumMaster);
    const existingMedium = await mediumRepoistry.findOneBy({
      mediumCode: payload.mediumCode,
    });
    if (!existingMedium) {
      const logsPayload: logsDto = {
        UserId: payload.loginUserId,
        UserName: payload.loginUserName,
        statusCode: 500,
        Message: `Validation Error: Invalid Medium Code (${payload.mediumCode})`,
      };
      await InsertLog(logsPayload);
      return res.status(400).json({
        ErrorMessage: "Medium not found",
      });
    }
    await mediumRepoistry
      .createQueryBuilder()
      .update(MediumMaster)
      .set({ status: payload.status })
      .where({ mediumCode: payload.mediumCode })
      .execute();

    const logsPayload: logsDto = {
      UserId: payload.loginUserId,
      UserName: payload.loginUserName,
      statusCode: 200,
      Message: `Changed  Medium Status for  ${existingMedium.medium} Medium to ${payload.status} By - `,
    };
    await InsertLog(logsPayload);
    return res
      .status(200)
      .json({ IsSuccess: "Medium Status updated Successfully !" });
  } catch (error) {
    const logsPayload: logsDto = {
      UserId: payload.loginUserId,
      UserName: payload.loginUserName,
      statusCode: 500,
      Message: ` Error while updating Medium status: ${error.message}`,
    };
    await InsertLog(logsPayload);
    return res.status(500).json({
      message: "Internal server error",
      error: error instanceof Error ? error.message : error,
    });
  }
};
