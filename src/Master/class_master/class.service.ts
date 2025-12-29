import { appSource } from "../../core/database/db";
import { ClassDto, classStatus, ClassValidation } from "./class.dto";
import { Request, Response } from "express";
import { classMaster } from "./class.model";
import { DataSource, Not } from "typeorm";
import { logsDto } from "../../logs/logs.dto";
import { InsertLog } from "../../logs/logs.service";

export const addClass = async (req: Request, res: Response) => {
  const payload: ClassDto = req.body;
  try {
    //check validationF
    const validation = ClassValidation.validate(payload);
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
    // check data whether existing
    const classRepository = appSource.getRepository(classMaster);
    const existingClass = await classRepository.findOneBy({
      className: payload.className,
    });

    if (existingClass) {
      const logsPayload: logsDto = {
        UserId: Number(payload.created_UserId),
        UserName: null,
        statusCode: 500,
        Message: `Error while saving class - ${payload.className} (Class Name already exists) -`,
      };
      await InsertLog(logsPayload);
      return res.status(400).json({
        ErrorMessage: " This Class Name is  already Existing !!",
      });
    }

    await classRepository.save(payload);
    const logsPayload: logsDto = {
      UserId: Number(payload.created_UserId),
      UserName: null,
      statusCode: 200,
      Message: `Added classmaster - classname (${payload.className})  Successfully By - `,
    };
    await InsertLog(logsPayload);
    return res.status(200).json({ IsSuccess: "Class Added Successfully !!" });
  } catch (error) {
    const logsPayload: logsDto = {
      UserId: Number(payload.created_UserId),
      UserName: null,
      statusCode: 500,
      Message: `Error while adding class - ${error.message}`,
    };
    await InsertLog(logsPayload);
    return res.status(500).json({
      message: "Internal server error",
      error: error instanceof Error ? error.message : error,
    });
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
    // console.log(error);
    return res.status(500).json({
      message: "Internal server error",
      error: error instanceof Error ? error.message : error,
    });
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
    return res.status(500).json({
      message: "Internal server error",
      error: error instanceof Error ? error.message : error,
    });
  }
};
export const updateClassMaster = async (req: Request, res: Response) => {
  const payload: ClassDto = req.body;
  try {
    //get the data
    const validation = ClassValidation.validate(payload);
    //validation
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
    // check whether class exist
    const classRepository = appSource.getRepository(classMaster);
    const existingClass = await classRepository.findOneBy({
      classCode: payload.classCode,
    });
    if (!existingClass) {
      const logsPayload: logsDto = {
        UserId: Number(payload.created_UserId),
        UserName: null,
        statusCode: 500,
        Message: `Validation Failed - Class Not Found (Code: ${payload.classCode})`,
      };
      await InsertLog(logsPayload);
      return res.status(400).json({
        ErrorMessage: "Class Doesn't exist",
      });
    }
    // check name already exist
    const nameExist = await classRepository.findBy({
      className: payload.className,
      classCode: Not(payload.classCode),
    });
    if (nameExist.length > 0) {
      const logsPayload: logsDto = {
        UserId: Number(payload.created_UserId),
        UserName: null,
        statusCode: 500,
        Message: `Updated Failed- Class Name Already Exists  classname-${payload.className}`,
      };
      await InsertLog(logsPayload);
      return res.status(400).json({
        ErrorMessage: "This Class Name is Already Existing !!",
      });
    }
    await classRepository.update({ classCode: payload.classCode }, payload);

    const logsPayload: logsDto = {
      UserId: Number(payload.created_UserId),
      UserName: null,
      statusCode: 200,
      Message: `Updated ClassMaster - classCode: ${existingClass.classCode}, Old className: ${existingClass.className} to  New className: ${payload.className} -`,
    };
    await InsertLog(logsPayload);
    return res
      .status(200)
      .json({ IsSuccess: "Class Updated successfully  !!" });
  } catch (error) {
    const logsPayload: logsDto = {
      UserId: Number(payload.created_UserId),
      UserName: null,
      statusCode: 500,
      Message: `Error while update class -${error.message}`,
    };
    await InsertLog(logsPayload);
    return res.status(500).json({
      message: "Internal server error",
      error: error instanceof Error ? error.message : error,
    });
  }
};

export const deleteClass = async (req: Request, res: Response) => {
    const classCode = Number(req.params.classCode);
    const { loginUserId, loginUserName } = req.body;
  try {
    if (isNaN(classCode)) {
      const logsPayload: logsDto = {
        UserId: loginUserId,
        UserName: loginUserName,
        statusCode: 500,
        Message: `Validation Failed - Invalid Class Code (${classCode})  by -`,
      };
      await InsertLog(logsPayload);
      return res.status(400).json({ ErrorMessage: "Invalid class code" });
    }

    const classRepository = appSource.getRepository(classMaster);
    //  check whether exist code
    const existingClass = await classRepository.findOneBy({
      classCode: classCode,
    });

    if (!existingClass) {
      const logsPayload: logsDto = {
        UserId: loginUserId,
        UserName: loginUserName,
        statusCode: 500,
        Message: `ClassMaster - classCode: ${existingClass.classCode}, className: ${existingClass.className} not found by - `,
      };
      await InsertLog(logsPayload);
      return res.status(404).json({ ErrorMessage: "Class not found" });
    }
    // delete and active
    await classRepository
      .createQueryBuilder()
      .update(classMaster)
      .set({ isActive: false })
      .where({ classCode: classCode })
      .execute();

    const logsPayload: logsDto = {
      UserId: loginUserId,
      UserName: loginUserName,
      statusCode: 200,
      Message: `Deleted ClassMaster classcode:${classCode} classname:  ${existingClass.className} By - `,
    };
    await InsertLog(logsPayload);

    return res.status(200).json({ IsSuccess: "Class Deleted Successfully !!" });
  } catch (error) {
    const logsPayload: logsDto = {
      UserId: loginUserId,
      UserName: loginUserName,
      statusCode: 500,
      Message: `Error while deleting classname - ${error.message}`,
    };
    await InsertLog(logsPayload);
    return res.status(500).json({
      message: "Internal server error",
      error: error instanceof Error ? error.message : error,
    });
  }
};
export const updateStatusClass = async (req: Request, res: Response) => {
    const payload: classStatus = req.body;
  try {

    const classRepository = appSource.getRepository(classMaster);
    //  check whether exist code
    const existingClass = await classRepository.findOneBy({
      classCode: payload.classCode,
    });
    if (!existingClass) {
     const logsPayload: logsDto = {
        UserId: payload.loginUserId,
        UserName: payload.loginUserName,
        statusCode: 500,
        Message: `class not found for classCode ${payload.classCode} by - `,
      };
      await InsertLog(logsPayload);
      return res.status(404).json({ ErrorMessage: "Class not found" });
    }
    await classRepository
      .createQueryBuilder()
      .update(classMaster)
      .set({ status: payload.status })
      .where({ classCode: payload.classCode })
      .execute();
    const logsPayload: logsDto = {
      UserId: payload.loginUserId,
      UserName: payload.loginUserName,
      statusCode: 200,
      Message: `Changed classmaster Status for  ${existingClass.className} to ${payload.status} By - `,
    };
    await InsertLog(logsPayload);
    return res
      .status(200)
      .json({ IsSuccess: "Class  Status updated Successfully !! " });
  } catch (error) {
    const logsPayload: logsDto = {
      UserId: payload.loginUserId,
      UserName: payload.loginUserName,
      statusCode: 500,
      Message: `Error while updating class status - ${error.message}`,
    };
    await InsertLog(logsPayload);

    return res.status(500).json({
      message: "Internal server error",
      error: error instanceof Error ? error.message : error,
    });
  }
};
