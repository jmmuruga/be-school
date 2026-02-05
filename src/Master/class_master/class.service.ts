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

const { loginUserName, ...data } = payload;
await classRepository.save(data);

    const logsPayload: logsDto = {
      UserId: Number(payload.created_UserId),
      UserName: payload.loginUserName,
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
// get the classId
export const getClassId = async (req: Request, res: Response) => {
  try {
    const classRepositry = appSource.getRepository(classMaster);
    let Class_Id = await classRepositry.query(
      `SELECT Class_Id
            FROM [${process.env.DB_NAME}].[dbo].[class_master] 
            Group by Class_Id
            ORDER BY CAST(Class_Id AS INT) DESC;`,
    );
    let id = "0";
    if (Class_Id?.length > 0) {
      id = Class_Id[0].Class_Id;
    }
    const finalRes = Number(id) + 1;
    res.status(200).send({
      Result: finalRes,
    });
  } catch (error) {
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
      Class_Id: payload.Class_Id,
    });
    if (!existingClass) {
      const logsPayload: logsDto = {
        UserId: Number(payload.created_UserId),
        UserName: null,
        statusCode: 500,
        Message: `Validation Failed - Class Not Found (Code: ${payload.Class_Id})`,
      };
      await InsertLog(logsPayload);
      return res.status(400).json({
        ErrorMessage: "Class Doesn't exist",
      });
    }
    // check name already exist
    const nameExist = await classRepository.findBy({
      className: payload.className,
      Class_Id: Not(payload.Class_Id),
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

    const { loginUserName, ...data } = payload;
await classRepository.update({ Class_Id: payload.Class_Id }, data);

    const logsPayload: logsDto = {
      UserId: Number(payload.created_UserId),
      UserName: payload.loginUserName,
      statusCode: 200,
      Message: `Updated ClassMaster - Class_Id: ${existingClass.Class_Id}, Old className: ${existingClass.className} to  New className: ${payload.className} -`,
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
  const Class_Id = Number(req.params.Class_Id);
  const { loginUserId, loginUserName } = req.body;
  try {
    if (isNaN(Class_Id)) {
      const logsPayload: logsDto = {
        UserId: loginUserId,
        UserName: loginUserName,
        statusCode: 500,
        Message: `Validation Failed - Invalid Class Code (${Class_Id})  by -`,
      };
      await InsertLog(logsPayload);
      return res.status(400).json({ ErrorMessage: "Invalid class code" });
    }

    const classRepository = appSource.getRepository(classMaster);
    //  check whether exist code
    const existingClass = await classRepository.findOneBy({
      Class_Id: Class_Id,
    });

    if (!existingClass) {
      const logsPayload: logsDto = {
        UserId: loginUserId,
        UserName: loginUserName,
        statusCode: 500,
        Message: `ClassMaster - Class_Id: ${existingClass.Class_Id}, className: ${existingClass.className} not found by - `,
      };
      await InsertLog(logsPayload);
      return res.status(404).json({ ErrorMessage: "Class not found" });
    }
    // delete and active
    await classRepository
      .createQueryBuilder()
      .update(classMaster)
      .set({ isActive: false })
      .where({ Class_Id: Class_Id })
      .execute();

    const logsPayload: logsDto = {
      UserId: loginUserId,
      UserName: loginUserName,
      statusCode: 200,
      Message: `Deleted ClassMaster Class_Id:${Class_Id} classname:  ${existingClass.className} By - `,
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
      Class_Id: payload.Class_Id,
    });
    if (!existingClass) {
      const logsPayload: logsDto = {
        UserId: payload.loginUserId,
        UserName: payload.loginUserName,
        statusCode: 500,
        Message: `class not found for Class_Id ${payload.Class_Id} by - `,
      };
      await InsertLog(logsPayload);
      return res.status(404).json({ ErrorMessage: "Class not found" });
    }
    await classRepository
      .createQueryBuilder()
      .update(classMaster)
      .set({ status: payload.status })
      .where({ Class_Id: payload.Class_Id })
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
