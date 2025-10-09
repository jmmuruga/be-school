import { Router } from "express";
import {
  addSchool,
  getSchoolCode,
  getSchoolDetails,
  updateSchool,
} from "./school.service";

const schoolRouter = Router();
schoolRouter.post("/addSchool", (req, res) => addSchool(req, res));
schoolRouter.get("/getSchoolCode", (req, res) => getSchoolCode(req, res));
schoolRouter.get("/getSchoolDetails", (req, res) => getSchoolDetails(req, res));
schoolRouter.post("/updateSchool", (req, res) => updateSchool(req, res));
export default schoolRouter;
