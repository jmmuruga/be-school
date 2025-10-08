import { appSource } from "../../core/database/db";
import { MarkDto, MarkValidation } from "./mark.dto";
import { Request, Response } from "express";
import { MarkMaster } from "./mark.model";

export const getMarkMasterDetails = async (req: Request, res: Response) => {
  try {
    const markRepository = appSource.getRepository(MarkMaster);
    const MarkM = await markRepository.createQueryBuilder("").getMany();
    res.status(200).send({
      Result: MarkM,
    });
    console.log(res, 'mark')
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
