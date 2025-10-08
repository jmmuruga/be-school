import { Router } from "express";
import { addSchool, getSchoolCode, getSchoolDetails } from "./school.service";

const schoolRouter = Router();
schoolRouter.post("/addSchool" ,(req,res) => addSchool(req,res));
schoolRouter.get("/getSchoolCode", (req, res) => getSchoolCode(req, res));
schoolRouter.get("/getSchoolDetails",(req,res) =>getSchoolDetails(req,res));
export default schoolRouter;