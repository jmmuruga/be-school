import { Router } from "express";
import { addSchool } from "./school.service";

const schoolRouter = Router();
schoolRouter.post('/addSchool' ,(req,res) => addSchool(req,res));
export default schoolRouter;