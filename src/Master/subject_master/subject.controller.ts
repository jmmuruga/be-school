import { Router } from "express";
import {
  addSubject,
  deleteSubject,
  getsubjectCode,
  getSubjectDetails,
  updateSubject,
  updateSubjectStatus,
} from "./subject.service";
const subjectRouter = Router();
subjectRouter.post("/addSubject", (req, res) => addSubject(req, res));
subjectRouter.get("/getsubjectCode", (req, res) => getsubjectCode(req, res));
subjectRouter.get("/getSubjectDetails", (req, res) =>
  getSubjectDetails(req, res)
);
subjectRouter.post("/updateSubject", (req, res) => updateSubject(req, res));
subjectRouter.delete("/deleteSubject/:subjectCode",(req,res) => deleteSubject(req,res))
export default subjectRouter;
subjectRouter.post("/updateSubjectStatus",(req,res) => updateSubjectStatus(req,res));