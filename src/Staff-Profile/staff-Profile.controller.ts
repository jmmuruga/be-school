import { Router } from "express";
import { Staff } from "./staff-Profile.model";
import { addStaff, getStaffNo } from "./staff-Profile.service";

const StaffRouter = Router();
StaffRouter.post('/addUser',(req,res) =>addStaff(req,res));

StaffRouter.get('/getStaffNo',(req,res) =>getStaffNo(req,res));

export default StaffRouter;