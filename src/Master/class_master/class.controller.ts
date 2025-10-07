import { Router } from "express";
import { addClass, getClassCode } from "./class.service";

const classRouter = Router();

classRouter.post('/addClass' , (req,res) => addClass(req,res));

classRouter.get("/getClassCode", (req, res) => getClassCode(req, res));

export default classRouter; 
