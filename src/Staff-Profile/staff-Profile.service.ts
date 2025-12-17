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
  try {
    const payload: StaffDto = req.body;
    const validation = StaffValidation.validate(payload);
    if (validation.error) {
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
      return res.status(400).json({
        ErrorMessage: "Email Already Exists",
      });
    }
    const phoneExisting = await staffRepository.findBy({
      contactNo: payload.contactNo,
      staffNo: Not(payload.staffNo),
    });
    if (phoneExisting.length > 0) {
      return res.status(400).json({
        ErrorMessage: "Contact no Already Exists",
      });
    }

    await staffRepository.save(payload);
    const logsPayload: logsDto = {
      UserId: Number(payload.created_UserId),
      UserName: null,
      statusCode: 200,
      Message: `Staff Added Successfully By - `,
    };
    await InsertLog(logsPayload);
    return res.status(200).json({ IsSuccess: "Staff Added Successfully !!" });
  } catch (error) {
    // console.error(error);
    return res.status(500).json({ message: "Internal server error" });
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
    return res.status(500).json({ message: "Internal server error" });
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
    // console.log(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
export const updateStaffDetls = async (req: Request, res: Response) => {
  try {
    // get the data
    const payload: StaffDto = req.body;
    const validation = StaffValidation.validate(payload);
    //   validation
    if (validation.error) {
      console.log(validation.error, "Validation Error");
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
      return res.status(400).json({
        ErrorMessage: "Staff Name Already Existing",
      });
    }
    const emailExisting = await staffRepository.findBy({
      email: payload.email,
      staffNo: Not(payload.staffNo),
    });
    if (emailExisting.length > 0) {
      return res.status(400).json({
        ErrorMessage: "Email Already Existing",
      });
    }
    const contactExisting = await staffRepository.findBy({
      contactNo: payload.contactNo,
      staffNo: Not(payload.staffNo),
    });
    if (contactExisting.length > 0) {
      return res.status(400).json({
        ErrorMessage: "Contact no Already Existing",
      });
    }
    await staffRepository.update({ staffNo: payload.staffNo }, payload);

    const logsPayload: logsDto = {
      UserId: Number(payload.created_UserId),
      UserName: null,
      statusCode: 200,
      Message: `Staff Updated Successfully By - `,
    };
    await InsertLog(logsPayload);

    return res.status(200).json({ IsSuccess: "Staff Updated Successfully !!" });
  } catch (error) {
    // console.error("Update Error:", error);
    return res.status(500).json({
      message: "Internal server error",
      error: error instanceof Error ? error.message : error,
    });
  }
};
export const deleteStaff = async (req: Request, res: Response) => {
  try {
    const staffNo = Number(req.params.staffNo);
    const { loginUserId, loginUserName } = req.body;

    // console.log("deleting Staff:", staffNo);
    if (isNaN(staffNo)) {
      return res.status(400).json({ ErrorMessage: "Invalid Staff No" });
    }
    const staffRepository = appSource.getRepository(Staff);
    // check whether exist no
    const existingStaff = await staffRepository.findOneBy({
      staffNo: staffNo,
    });
    if (!existingStaff) {
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
    // console.error("delete error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
export const updateStaffStatus = async (req: Request, res: Response) => {
  try {
    const payload: StaffStatus = req.body;

    const staffRepository = appSource.getRepository(Staff);
    const existingStaff = await staffRepository.findOneBy({
      staffNo: payload.staffNo,
    });
    if (!existingStaff) {
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
      Message: `Changed Status for  ${existingStaff.staffName} to ${payload.status} By - `,
    };
    await InsertLog(logsPayload);

    return res
      .status(200)
      .json({ IsSuccess: "Staff Status updated Successfully !" });
  } catch (error) {
    // console.error("Update Error:", error);
    return res.status(500).json({
      message: "Internal server error",
    });
  }
};
