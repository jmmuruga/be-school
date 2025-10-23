import { Router } from "express";
import {
  addSchool,
  deleteSchool,
  getSchoolCode,
  getSchoolDetails,
  updateSchool,
  updateSchoolStatus,
} from "./school.service";

const schoolRouter = Router();
schoolRouter.post("/addSchool", (req, res) => addSchool(req, res));
schoolRouter.get("/getSchoolCode", (req, res) => getSchoolCode(req, res));
schoolRouter.get("/getSchoolDetails", (req, res) => getSchoolDetails(req, res));
schoolRouter.post("/updateSchool", (req, res) => updateSchool(req, res));
schoolRouter.delete("/deleteSchool/:schoolCode",(req,res) => deleteSchool(req,res));
export default schoolRouter;
schoolRouter.post("/updateSchoolStatus",(req,res) => updateSchoolStatus(req,res));