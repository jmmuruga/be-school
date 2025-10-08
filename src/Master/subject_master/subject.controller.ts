import { Router } from "express";
import { addSubject ,getsubjectCode, getSubjectDetails} from "./subject.service";
const subjectRouter = Router();
subjectRouter.post('/addSubject' , (req,res) => addSubject(req,res));
subjectRouter.get("/getsubjectCode", (req, res) => getsubjectCode(req, res));
subjectRouter.get("/getSubjectDetails",(req,res) => getSubjectDetails(req,res));
export default subjectRouter;