import { appSource } from "../../core/database/db";
import { ClassDto, ClassValidation } from "./class.dto";
import { Request, Response } from "express";
import { classMaster } from "./class.model";
import { getChangedProperty } from "../../shared/helper";

export const addClass = async (req: Request, res: Response) => {
  try {
    const payload: ClassDto = req.body;

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

    return res.status(200).json({ message: "Class added successfully" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

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
    const classM = await classRepositry.createQueryBuilder("").getMany();
    res.status(200).send({
      Result: classM,
    });
  } catch (error) {
    console.log(error);
  }
};

// export const updateClassMaster = async (req: Request, res: Response) => {
//   const payload: ClassDto = req.body;
//   try {
//     // Validation
//     const validation = ClassValidation.validate(payload);
//     if (validation.error) {
//       console.log(validation.error, "Validation Error");
//       return res.status(400).json({
//         message: validation.error.details[0].message,
//       });
//     }
//     const classRepository = appSource.getRepository(classMaster);
//     const existingDetails = await classRepository.findOneBy({
//       classCode: payload.classCode,
//     });

//     await classRepository
//       .update({ classCode: payload.classCode }, payload)
//       .then(async () => {
//         const updatedFields: string = await getChangedProperty(
//           [payload],
//           [existingDetails]
//         );

//         res.status(200).send({
//           IsSuccess: "Brand Details Updated Successfully",
//         });
//       });
//   } catch (error) {
//     console.error(error);
//     return res.status(500).json({ message: "Internal server error" });
//   }
// };

export const updateClassMaster = async (req: Request, res: Response) => {
  try {
    const payload: ClassDto = req.body;

    const { error } = ClassValidation.validate(payload);
    if (error) {
      console.log(error, "Validation Error");
      return res.status(400).json({
        message: error.details[0].message,
      });
    }

    const classRepository = appSource.getRepository(classMaster);

    const existingDetails = await classRepository.findOne({
      where: { classCode: payload.classCode },
    });

    if (!existingDetails) {
      return res.status(404).json({
        message: `Class with code ${payload.classCode} not found.`,
      });
    }

    await classRepository.update(
      { classCode: payload.classCode },
      { ...payload }
    );

    const updatedRecord = await classRepository.findOne({
      where: { classCode: payload.classCode },
    });

    const updatedFields = await getChangedProperty(
      [updatedRecord],
      [existingDetails]
    );

    return res.status(200).json({ message: "Class added successfully" });
  } catch (error) {
    console.error("Update Error:", error);
    return res.status(500).json({
      message: "Internal server error",
      error: error instanceof Error ? error.message : error,
    });
  }
};
