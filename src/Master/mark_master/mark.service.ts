import { appSource } from "../../core/database/db";
import { MarkDto, markStatus, MarkValidation } from "./mark.dto";
import { Request, Response } from "express";
import { MarkMaster } from "./mark.model";
import { Not } from "typeorm";

export const getMarkMasterDetails = async (req: Request, res: Response) => {
  try {
    const markRepository = appSource.getRepository(MarkMaster);
    const MarkM = await markRepository.find({
      where: { isActive: true },
    });
    // const MarkM = await markRepository.createQueryBuilder("").getMany();
    res.status(200).send({
      Result: MarkM,
    });
    console.log(res, "mark");
  } catch (error) {
    console.log(error);
  }
};

export const addMark = async (req: Request, res: Response) => {
  try {
    const payload: MarkDto = req.body;
    const validation = MarkValidation.validate(payload);
    if (validation.error) {
      return res.status(400).json({
        message: validation.error.details[0].message,
      });
    }

    const markRepository = appSource.getRepository(MarkMaster);
    const existingMark = await markRepository.findOneBy({
      mark: payload.mark,
    });
    if (existingMark) {
      return res.status(400).json({
        message: "Mark already exists",
      });
    }
    await markRepository.save(payload);
    return res.status(200).json({ message: "Mark added successfully" });
  } catch (error) {
    console.log(error);
  }
};
export const getMarkCode = async (req: Request, res: Response) => {
  try {
    const markRepositry = appSource.getRepository(MarkMaster);
    let markCode = await markRepositry.query(
      `SELECT markCode
            FROM [${process.env.DB_NAME}].[dbo].[mark_master] 
            Group by markCode
            ORDER BY CAST(markCode AS INT) DESC;`
    );
    let id = "0";
    if (markCode?.length > 0) {
      id = markCode[0].markCode;
    }
    const finalRes = Number(id) + 1;
    res.status(200).send({
      Result: finalRes,
    });
  } catch (error) {
    console.log(error);
  }
};
export const updateMark = async (req: Request, res: Response) => {
  try {
    const payload: MarkDto = req.body;
    // console.log("Update Payload:", payload);
    const validation = MarkValidation.validate(payload);
    if (validation.error) {
      console.log(validation.error, "Validation Error");
      return res.status(400).json({
        message: validation.error.details[0].message,
      });
    }
    //check  whether mark exist
    const markRepository = appSource.getRepository(MarkMaster);
    const existingMark = await markRepository.findOneBy({
      markCode: payload.markCode,
    });
    if (!existingMark) {
      return res.status(400).json({
        message: "Mark Doesn't exist",
      });
    }
    // check mark already exist
    const markExist = await markRepository.findBy({
      mark: payload.mark,
      markCode: Not(payload.markCode),
    });
    if (markExist.length > 0) {
      return res.status(400).json({
        message: "Mark Already Exist",
      });
    }
    await markRepository.update({ markCode: payload.markCode }, payload);
    return res.status(200).json({ message: "Mark Updated successfully" });
  } catch (error) {
    console.error("Update Error:", error);
    return res.status(500).json({
      message: "Internal server error",
      error: error instanceof Error ? error.message : error,
    });
  }
};
export const deleteMarks = async (req: Request, res: Response) => {
  try {
    const markCode = Number(req.params.markCode);
    // console.log("Soft deleting mark:", markCode);

    if (isNaN(markCode)) {
      return res.status(400).json({
        message: "Invalid Mark Code",
      });
    }
    const markRepository = appSource.getRepository(MarkMaster);
    // check whether markcode exists
    const existingMark = await markRepository.findOneBy({ markCode: markCode });

    if (!existingMark) {
      return res.status(404).json({
        message: "MarkCode not found",
      });
    }
    await markRepository
      .createQueryBuilder()
      .delete()
      .update(MarkMaster)
      .set({ isActive: false })
      .where({ markCode: markCode })
      .execute();
    // await markRepository.delete(markCode);
    return res.status(200).json({
      message: "Mark deleted successfully",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Internal server error",
    });
  }
};
export const updateMarkStatus = async (req: Request, res: Response) => {
  try {
    const payload: markStatus = req.body;
    const markRepository = appSource.getRepository(MarkMaster);
    // check whether markcode exists
    const existingMark = await markRepository.findOneBy({ 
      markCode: payload.markCode,
    });
    if (!existingMark) {
      return res.status(400).json({
        message: "Mark not found",
      });
    }
    await markRepository
      .createQueryBuilder()
      .update(MarkMaster)
      .set({ status: payload.status })
      .where({ markCode: payload.markCode })
      .execute();
    return res.status(200).json({
      message: "Mark status updated successfully",
    });
  } catch (error) {
    console.error("update error",error);
    return res.status(500).json({ 
      message: "Internal server error",
    });
  }
};