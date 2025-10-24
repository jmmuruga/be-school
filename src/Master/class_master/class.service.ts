import { appSource } from "../../core/database/db";
import { ClassDto, classStatus, ClassValidation } from "./class.dto";
import { Request, Response } from "express";
import { classMaster } from "./class.model";
import { DataSource, Not } from "typeorm";

export const addClass = async (req: Request, res: Response) => {
  try {
    // get the data
    const payload: ClassDto = req.body;
    //check validation
    const validation = ClassValidation.validate(payload);
    if (validation.error) {
      console.log(validation.error, "Validation Error");
      return res.status(400).json({
        message: validation.error.details[0].message,
      });
    }
    const classRepository = appSource.getRepository(classMaster);
    const existingClass = await classRepository.findOneBy({
      className: payload.className,
    });

    if (existingClass) {
      return res.status(400).json({
        message: "Class Name already exists",
      });
    }

    await classRepository.save(payload);

    return res.status(200).json({ IsSuccess: "Class Added Successfully !!" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
// get the classcode
export const getClassCode = async (req: Request, res: Response) => {
  try {
    const classRepositry = appSource.getRepository(classMaster);
    let classCode = await classRepositry.query(
      `SELECT classCode
            FROM [${process.env.DB_NAME}].[dbo].[class_master] 
            Group by classCode
            ORDER BY CAST(classCode AS INT) DESC;`
    );
    let id = "0";
    if (classCode?.length > 0) {
      id = classCode[0].classCode;
    }
    const finalRes = Number(id) + 1;
    res.status(200).send({
      Result: finalRes,
    });
  } catch (error) {
    console.log(error);
  }
};

export const getClasMasterDetails = async (req: Request, res: Response) => {
  try {
    const classRepositry = appSource.getRepository(classMaster);
    //get the details
    const classes = await classRepositry.find({
      where: { isActive: true },
    });
    // const classM = await classRepositry.createQueryBuilder("").getMany();
    res.status(200).send({
      Result: classes,
    });
  } catch (error) {
    console.log(error);
  }
};
export const updateClassMaster = async (req: Request, res: Response) => {
  try {
    //get the data
    const payload: ClassDto = req.body;
    const validation = ClassValidation.validate(payload);
    //validation
    if (validation.error) {
      console.log(validation.error, "Validation Error");
      return res.status(400).json({
        message: validation.error.details[0].message,
      });
    }
    // check whether class exist
    const classRepository = appSource.getRepository(classMaster);
    const existingClass = await classRepository.findOneBy({
      classCode: payload.classCode,
    });
    if (!existingClass) {
      return res.status(400).json({
        message: "Class Doesn't exist",
      });
    }
    // check name already exist
    const nameExist = await classRepository.findBy({
      className: payload.className,
      classCode: Not(payload.classCode),
    });
    if (nameExist.length > 0) {
      return res.status(400).json({
        message: "Class Name Already Exist",
      });
    }
    await classRepository.update({ classCode: payload.classCode }, payload); //update
    return res
      .status(200)
      .json({ IsSuccess: "Class Updated successfully  !!" });
  } catch (error) {
    console.error("Update Error:", error);
    return res.status(500).json({
      message: "Internal server error",
      error: error instanceof Error ? error.message : error,
    });
  }
};

export const deleteClass = async (req: Request, res: Response) => {
  try {
    const classCode = Number(req.params.classCode);
    // console.log(" deleting class:", classCode);

    if (isNaN(classCode)) {
      return res.status(400).json({ ErrorMessage: "Invalid class code" });
    }

    const classRepository = appSource.getRepository(classMaster);

    //  check whether exist code
    const existingClass = await classRepository.findOneBy({
      classCode: classCode,
    });

    if (!existingClass) {
      return res.status(404).json({ ErrorMessage: "Class not found" });
    }
    // delete and active
    await classRepository
      .createQueryBuilder()
      .update(classMaster)
      .set({ isActive: false })
      .where({ classCode: classCode })
      .execute();

    return res.status(200).json({ IsSuccess: "Class Deleted Successfully !!" });
  } catch (error) {
    console.error("delete error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
export const updateStatusClass = async (req: Request, res: Response) => {
  try {
    const payload: classStatus = req.body;

    const classRepository = appSource.getRepository(classMaster);
    //  check whether exist code
    const existingClass = await classRepository.findOneBy({
      classCode: payload.classCode,
    });
    if (!existingClass) {
      return res.status(404).json({ ErrorMessage: "Class not found" });
    }
    await classRepository
      .createQueryBuilder()
      .update(classMaster)
      .set({ status: payload.status })
      .where({ classCode: payload.classCode })
      .execute();

    return res
      .status(200)
      .json({ IsSuccess: "Class  Status updated Successfully !! " });
  } catch (error) {
    console.error("update error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
