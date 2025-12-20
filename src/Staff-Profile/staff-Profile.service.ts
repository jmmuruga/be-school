import { Request, Response } from "express";
import { StaffDto, StaffStatus } from "./staff-Profile.dto";
import { StaffValidation } from "./staff-Profile.dto";
import { appSource } from "../core/database/db";
import { Staff } from "./staff-Profile.model";
import { Not } from "typeorm";
import { invalid } from "joi";
import { logsDto } from "../logs/logs.dto";
import { InsertLog } from "../logs/logs.service";
export const addStaff = async (req: Request, res: Response) => {
  const payload: StaffDto = req.body;
  try {
    const validation = StaffValidation.validate(payload);
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
    const staffRepository = appSource.getRepository(Staff);
    // check data whether existing
    const existingName = await staffRepository.findOneBy({
      staffName: payload.staffName,
      staffNo: payload.staffNo,
    });

    if (existingName) {
      const logsPayload: logsDto = {
        UserId: Number(payload.created_UserId),
        UserName: null,
        statusCode: 500,
        Message: `Error while saving staff detail - ${payload.staffName} (staff Name already exists) -`,
      };
      await InsertLog(logsPayload);
      return res.status(400).json({
        ErrorMessage: "Staff Already Exists",
      });
    }
    // check data whether existing
    const emailExisting = await staffRepository.findBy({
      email: payload.email,
      staffNo: Not(payload.staffNo),
    });
    if (emailExisting.length > 0) {
      const logsPayload: logsDto = {
        UserId: Number(payload.created_UserId),
        UserName: null,
        statusCode: 500,
        Message: `Error while saving email - ${payload.email} (email already exists) -`,
      };
      await InsertLog(logsPayload);
      return res.status(400).json({
        ErrorMessage: "Email Already Exists",
      });
    }
    const phoneExisting = await staffRepository.findBy({
      contactNo: payload.contactNo,
      staffNo: Not(payload.staffNo),
    });
    if (phoneExisting.length > 0) {
      const logsPayload: logsDto = {
        UserId: Number(payload.created_UserId),
        UserName: null,
        statusCode: 500,
        Message: `Error while saving contactno - ${payload.contactNo} (Contactno is  already exists) -`,
      };
      await InsertLog(logsPayload);
      return res.status(400).json({
        ErrorMessage: "Contact no Already Exists",
      });
    }

    await staffRepository.save(payload);
    const logsPayload: logsDto = {
      UserId: Number(payload.created_UserId),
      UserName: null,
      statusCode: 200,
      Message: `Added Staff Details - staffname (${payload.staffName})  Successfully By - `,
    };
    await InsertLog(logsPayload);
    return res
      .status(200)
      .json({ IsSuccess: "Staff Details Added Successfully !!" });
  } catch (error) {
    const logsPayload: logsDto = {
      UserId: Number(payload.created_UserId),
      UserName: null,
      statusCode: 500,
      Message: `Error while adding staff Details - ${error.message}`,
    };
    await InsertLog(logsPayload);
    return res.status(500).json({
      message: "Internal server error",
      error: error instanceof Error ? error.message : error,
    });
  }
};
export const getStaffNo = async (req: Request, res: Response) => {
  try {
    const staffRepository = appSource.getRepository(Staff);
    let staffNo = await staffRepository.query(
      `SELECT staffNo
        FROM [${process.env.DB_NAME}].[dbo].[staff] 
        Group by staffNo
        ORDER BY CAST(staffNo AS INT) DESC;`
    );
    let id = "0";
    if (staffNo?.length > 0) {
      id = staffNo[0].staffNo;
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
export const getStaffDetails = async (req: Request, res: Response) => {
  try {
    const staffRepository = appSource.getRepository(Staff);
    // get the details
    const StaffS = await staffRepository.find({ where: { isActive: true } });
    res.status(200).send({
      Result: StaffS,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Internal server error",
      error: error instanceof Error ? error.message : error,
    });
  }
};
export const updateStaffDetls = async (req: Request, res: Response) => {
  // get the data
  const payload: StaffDto = req.body;
  try {
    const validation = StaffValidation.validate(payload);
    //   validation
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
    // check whether staff exist
    const staffRepository = appSource.getRepository(Staff);
    // check staff name already exist
    const nameExist = await staffRepository.findBy({
      staffName: payload.staffName,
      staffNo: Not(payload.staffNo),
    });
    if (nameExist.length > 0) {
      const logsPayload: logsDto = {
        UserId: Number(payload.created_UserId),
        UserName: null,
        statusCode: 500,
        Message: `Error while Updating staffname - ${payload.staffName} (staff Name already exists) -`,
      };
      await InsertLog(logsPayload);
      return res.status(400).json({
        ErrorMessage: "Staff Name Already Existing",
      });
    }
    const emailExisting = await staffRepository.findBy({
      email: payload.email,
      staffNo: Not(payload.staffNo),
    });
    if (emailExisting.length > 0) {
      const logsPayload: logsDto = {
        UserId: Number(payload.created_UserId),
        UserName: null,
        statusCode: 500,
        Message: ` Error while Updating Email - ${payload.email} (email already exists),staffno: ${payload.staffNo} by -`,
      };
      await InsertLog(logsPayload);
      return res.status(400).json({
        ErrorMessage: "Email Already Existing",
      });
    }
    const contactExisting = await staffRepository.findBy({
      contactNo: payload.contactNo,
      staffNo: Not(payload.staffNo),
    });
    if (contactExisting.length > 0) {
      const logsPayload: logsDto = {
        UserId: Number(payload.created_UserId),
        UserName: null,
        statusCode: 500,
        Message: ` Error while Updating contactno - ${payload.contactNo} (contactno already exists),staffno: ${payload.staffNo} by -`,
      };
      await InsertLog(logsPayload);
      return res.status(400).json({
        ErrorMessage: "Contact no Already Existing",
      });
    }
    await staffRepository.update({ staffNo: payload.staffNo }, payload);

    const logsPayload: logsDto = {
      UserId: Number(payload.created_UserId),
      UserName: null,
      statusCode: 200,
      Message: `Staff Details  Updated  staffname : ${payload.staffName}  Successfully By - `,
    };
    await InsertLog(logsPayload);

    return res.status(200).json({ IsSuccess: "Staff Updated Successfully !!" });
  } catch (error) {
    const logsPayload: logsDto = {
      UserId: Number(payload.created_UserId),
      UserName: null,
      statusCode: 500,
      Message: `Error while update staff details -${error.message}`,
    };
    await InsertLog(logsPayload);
    return res.status(500).json({
      message: "Internal server error",
      error: error instanceof Error ? error.message : error,
    });
  }
};
export const deleteStaff = async (req: Request, res: Response) => {
  const staffNo = Number(req.params.staffNo);
  const { loginUserId, loginUserName } = req.body;
  try {
    if (isNaN(staffNo)) {
      const logsPayload: logsDto = {
        UserId: loginUserId,
        UserName: loginUserName,
        statusCode: 500,
        Message: `Validation Failed - Invalid staffNo (${staffNo})  by -`,
      };
      await InsertLog(logsPayload);
      return res.status(400).json({ ErrorMessage: "Invalid Staff No" });
    }
    const staffRepository = appSource.getRepository(Staff);
    // check whether exist no
    const existingStaff = await staffRepository.findOneBy({
      staffNo: staffNo,
    });
    if (!existingStaff) {
      const logsPayload: logsDto = {
        UserId: loginUserId,
        UserName: loginUserName,
        statusCode: 500,
        Message: `Staff Details - staffNo: ${existingStaff.staffNo}, staffName: ${existingStaff.staffName} not found by - `,
      };
      await InsertLog(logsPayload);
      return res.status(404).json({ ErrorMessage: "Staff not found" });
    }

    // delete and active
    await staffRepository
      .createQueryBuilder()
      .update(Staff)
      .set({ isActive: false })
      .where({ staffNo: staffNo })
      .execute();

    const logsPayload: logsDto = {
      UserId: loginUserId,
      UserName: loginUserName,
      statusCode: 200,
      Message: `Staff Detail delete  ${existingStaff.staffNo} & ${existingStaff.staffName} Successfully By - `,
    };
    await InsertLog(logsPayload);
    return res
      .status(200)
      .json({ IsSuccess: "Staff Deleted SuccessFullyy !!" });
  } catch (error) {
    const logsPayload: logsDto = {
      UserId: loginUserId,
      UserName: loginUserName,
      statusCode: 500,
      Message: `Error while deleting staffNo 
      ${staffNo} - ${error.message}`,
    };
    await InsertLog(logsPayload);
    return res.status(500).json({ message: "Internal server error" });
  }
};
export const updateStaffStatus = async (req: Request, res: Response) => {
  const payload: StaffStatus = req.body;
  try {
    const staffRepository = appSource.getRepository(Staff);
    const existingStaff = await staffRepository.findOneBy({
      staffNo: payload.staffNo,
    });
    if (!existingStaff) {
      const logsPayload: logsDto = {
        UserId: payload.loginUserId,
        UserName: payload.loginUserName,
        statusCode: 500,
        Message: `staff not found for staffNo ${payload.staffNo} by - `,
      };
      await InsertLog(logsPayload);
      return res.status(400).json({
        ErrorMessage: "staff not found",
      });
    }
    await staffRepository
      .createQueryBuilder()
      .update(Staff)
      .set({ status: payload.status })
      .where({ staffNo: payload.staffNo })
      .execute();
    const logsPayload: logsDto = {
      UserId: payload.loginUserId,
      UserName: payload.loginUserName,
      statusCode: 200,
      Message: `Changed  Staff Status for  ${existingStaff.staffName} to ${payload.status} By - `,
    };
    await InsertLog(logsPayload);

    return res
      .status(200)
      .json({ IsSuccess: "Staff Status updated Successfully !" });
  } catch (error) {
    const logsPayload: logsDto = {
      UserId: payload.loginUserId,
      UserName: payload.loginUserName,
      statusCode: 500,
      Message: `Error while updating staff status - ${error.message}`,
    };
    await InsertLog(logsPayload);
    return res.status(500).json({
      message: "Internal server error",
      error: error instanceof Error ? error.message : error,
    });
  }
};
