import { Router } from "express";
import { addClass, getClass } from "./class.service";

const classRouter = Router();

classRouter.get('/getclass',(req,res) => getClass(req,res));
classRouter.post('/addClass' , (req,res) => addClass(req,res));


export default classRouter; 