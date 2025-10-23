import { appSource } from "../../core/database/db";
import { MediumDto, mediumStatus, MediumValidation } from "./medium.dto";
import { Request, Response } from "express";
import { MediumMaster } from "./medium.model";
import mediumRouter from "./medium.controller";
import { Not } from "typeorm";

export const addMedium = async (req: Request, res: Response) => {
  try {
    // get the data
    const payload: MediumDto = req.body;
    //check validation
    const validation = MediumValidation.validate(payload);
    if (validation.error) {
      return res.status(400).json({
        message: validation.error.details[0].message,
      });
    }
    const mediumRepoistry = appSource.getRepository(MediumMaster);
    const existingMedium = await mediumRepoistry.findOneBy({
      medium: payload.medium,
    });

    if (existingMedium) {
      return res.status(400).json({
        message: "Medium already exists",
      });
    }
    await mediumRepoistry.save(payload);
    return res.status(200).json({ message: "Medium added successfully" });
  } catch (error) {
    console.log(error);
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
    console.log(error);
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
    console.log(error);
  }
};
export const updateMedium = async (req: Request, res: Response) => {
  try {
    // get the data
    const payload: MediumDto = req.body;
    //check validation
    const validation = MediumValidation.validate(payload);
    if (validation.error) {
      console.log(validation.error, "Validation Error");
      return res.status(400).json({
        message: validation.error.details[0].message,
      });
    }
    // check whether medium exist
    const mediumRepoistry = appSource.getRepository(MediumMaster);
    const existingMedium = await mediumRepoistry.findOneBy({
      mediumCode: payload.mediumCode,
    });
    if (!existingMedium) {
      return res.status(400).json({
        message: "Medium Doesn't exist",
      });
    }
    // check medium already exists
    const mediumExist = await mediumRepoistry.findBy({
      medium: payload.medium,
      mediumCode: Not(payload.mediumCode),
    });
    if (mediumExist.length > 0) {
      return res.status(400).json({
        message: "Medium Already Exist",
      });
    }
    await mediumRepoistry.update({ mediumCode: payload.mediumCode }, payload);
    return res.status(200).json({ message: "Medium Updated successfully" });
  } catch (error) {
    console.error("Update Error:", error);
    return res.status(500).json({
      message: "Internal server error",
      error: error instanceof Error ? error.message : error,
    });
  }
};
export const deleteMedium = async (req: Request, res: Response) => {
  try {
    const mediumCode = Number(req.params.mediumCode);
    if (isNaN(mediumCode)) {
      return res.status(400).json({
        message: "Invalid class code",
      });
    }
    const mediumRepoistry = appSource.getRepository(MediumMaster);
    // Check whether mediumcode exists
    const existingMedium = await mediumRepoistry.findOneBy({
      mediumCode: mediumCode,
    });
    if (!existingMedium) {
      return res.status(404).json({
        message: "mediumCode  not found",
      });
    }
    //delete and active
    await mediumRepoistry
      .createQueryBuilder()
      .update(MediumMaster)
      .set({ isActive: false })
      .where({ mediumCode: mediumCode })
      .execute();
    // await mediumRepoistry.delete(mediumCode);
    return res.status(200).json({
      message: "mediumCode deleted successfully",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Internal server error",
    });
  }
};
export const updateMediumStatus = async (req: Request, res: Response) => {
  try {
    const payload: mediumStatus = req.body;
    const mediumRepoistry = appSource.getRepository(MediumMaster);
    const existingMedium = await mediumRepoistry.findOneBy({
      mediumCode: payload.mediumCode,
    });
    if (!existingMedium) {
      return res.status(400).json({
        message: "Medium not found",
      });
    }
    await mediumRepoistry
      .createQueryBuilder()
      .update(MediumMaster)
      .set({ status: payload.status })
      .where({ mediumCode: payload.mediumCode })
      .execute();
    return res
      .status(200)
      .json({ message: "Medium status updated successfully" });
  } catch (error) {
    console.error("Update Error:", error);
    return res.status(500).json({
      message: "Internal server error",
    });
  }
};
