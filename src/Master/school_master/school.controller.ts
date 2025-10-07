import { Router } from "express";
import { addSchool, getSchoolCode } from "./school.service";

const schoolRouter = Router();
schoolRouter.post('/addSchool' ,(req,res) => addSchool(req,res));
schoolRouter.get("/getSchoolCode", (req, res) => getSchoolCode(req, res));

export default schoolRouter;