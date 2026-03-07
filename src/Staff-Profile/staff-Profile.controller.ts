import { Router } from "express";
import { Staff } from "./staff-Profile.model";
import { addStaff, deleteStaff, getStaffDetails, getStaffNo, updateStaffDetls, updateStaffStatus } from "./staff-Profile.service";
import { auth } from "../shared/helper";

const StaffRouter = Router();
StaffRouter.post('/addStaff',auth,(req,res) =>addStaff(req,res));
StaffRouter.get('/getStaffDetails',auth,(req,res)=>getStaffDetails(req,res));
StaffRouter.get('/getStaffNo',auth,(req,res) =>getStaffNo(req,res));
StaffRouter.post("/updateStaffDetls",auth,(req,res)=>updateStaffDetls(req,res));
StaffRouter.delete("/deleteStaff/:staffNo",auth,(req,res)=>deleteStaff(req,res));
StaffRouter.post("/updateStaffStatus",auth,(req,res)=> updateStaffStatus(req,res));

export default StaffRouter;
