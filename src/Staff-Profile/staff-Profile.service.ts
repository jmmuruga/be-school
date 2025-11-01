import { Request, Response } from "express";
import { StaffDto } from "./staff-Profile.dto";
import { StaffValidation } from "./staff-Profile.dto";
import { appSource } from "../core/database/db";
import { Staff } from "./staff-Profile.model";
import {  Not } from "typeorm";
export const addStaff = async (req: Request, res: Response) => {
    try {
        const payload: StaffDto = req.body;
        const validation = StaffValidation.validate(payload);
        if (validation.error) {
            return res.status(400).json({
                message: validation.error.details[0].message,
            });
        }
        const  staffRepository = appSource.getRepository(Staff);
        // check data whether existing
    await staffRepository.save(payload);
    return res.status(200).json({ IsSuccess: "Staff Added Successfully !!" });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal server error" });
    }
} ;
export const getStaffNo = async(req:Request,res:Response) => {
    try{
        const staffRepository = appSource.getRepository(Staff);
        let staffNo = await staffRepository.query(
             
          `SELECT staffNo
        FROM [${process.env.DB_NAME}].[dbo].[staff] 
        Group by staffNo
        ORDER BY CAST(staffNo AS INT) DESC;`
    );
    let id = "0";
      if (staffNo?.length > 0) {
      id = staffNo[0].UserID;
    }
    const finalRes = Number(id) + 1;
    res.status(200).send({
      Result: finalRes,
    });
    }catch(error){
    console.log(error);
    }
}
