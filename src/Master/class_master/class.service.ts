import { appSource } from "../../core/database/db";
import { ClassDto, ClassValidation } from "./class.dto";
import { Request, Response } from "express";
import { classMaster } from "./class.model";

export const addClass = async (req: Request, res: Response) => {
  try {
    const payload: ClassDto = req.body;
    console.log(payload, "incomming payload");
    const validation = ClassValidation.validate(payload);
    if (validation.error) {
      console.log(validation.error, 'val err')
      return res.status(400).json({
        message: validation.error.details[0].message,
      });
    }
    const classRepoistry = appSource.getRepository(classMaster);
    await classRepoistry.save(payload);
    return res.status(200).json({ message: "Class added successfully" });
  } catch (error) {
    console.log(error);
  }
};

export const getClass = async (req: Request, res: Response) => {
  try {
    const classRepo = appSource.getRepository(classMaster);
    const classes = await classRepo.find();

    return res.status(200).json({
      message: "Classes fetched successfully",
      data: classes,
    });
  } catch (error) {
    console.error("Error fetching classes:", error);
    return res.status(500).json({
      message: "Failed to fetch classes",
      error,
    });
  }
};
