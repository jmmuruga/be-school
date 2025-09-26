import { Router } from "express";
import { addClass } from "./class.service";

const classRouter = Router();


classRouter.post('/addClass' , (req,res) => addClass(req,res));


export default classRouter;