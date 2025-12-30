import { Router } from "express";
import {
  addSubject,
  deleteSubject,
  getsubjectId,
  getSubjectDetails,
  updateSubject,
  updateSubjectStatus,
} from "./subject.service";
const subjectRouter = Router();
subjectRouter.post("/addSubject", (req, res) => addSubject(req, res));
subjectRouter.get("/getsubjectId", (req, res) => getsubjectId(req, res));
subjectRouter.get("/getSubjectDetails", (req, res) =>
  getSubjectDetails(req, res)
);
subjectRouter.post("/updateSubject", (req, res) => updateSubject(req, res));
subjectRouter.delete("/deleteSubject/:subject_Id",(req,res) => deleteSubject(req,res))
export default subjectRouter;
subjectRouter.post("/updateSubjectStatus",(req,res) => updateSubjectStatus(req,res));