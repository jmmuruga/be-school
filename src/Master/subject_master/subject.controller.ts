import { Router } from "express";
import { addSubject } from "./subject.service";
const subjectRouter = Router();
subjectRouter.post('/addSubject' , (req,res) => addSubject(req,res));
export default subjectRouter;