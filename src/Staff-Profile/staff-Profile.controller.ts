import { Router } from "express";
import { Staff } from "./staff-Profile.model";
import { addStaff, deleteStaff, getStaffDetails, getStaffNo, updateStaffDetls, updateStaffStatus } from "./staff-Profile.service";

const StaffRouter = Router();
StaffRouter.post('/addStaff',(req,res) =>addStaff(req,res));
StaffRouter.get('/getStaffDetails',(req,res)=>getStaffDetails(req,res));
StaffRouter.get('/getStaffNo',(req,res) =>getStaffNo(req,res));
StaffRouter.post("/updateStaffDetls",(req,res)=>updateStaffDetls(req,res));
StaffRouter.delete("/deleteStaff/:staffNo",(req,res)=>deleteStaff(req,res));

export default StaffRouter;
StaffRouter.post("/updateStaffStatus",(req,res)=> updateStaffStatus(req,res));
