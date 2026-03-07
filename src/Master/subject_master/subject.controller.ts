import { Router } from "express";
import {
  addSubject,
  deleteSubject,
  getsubjectId,
  getSubjectDetails,
  updateSubject,
  updateSubjectStatus,
} from "./subject.service";
import { auth } from "../../shared/helper";
const subjectRouter = Router();
subjectRouter.post("/addSubject", auth,(req, res) => addSubject(req, res));
subjectRouter.get("/getsubjectId", auth,(req, res) => getsubjectId(req, res));
subjectRouter.get("/getSubjectDetails",auth, (req, res) =>
  getSubjectDetails(req, res)
);
subjectRouter.post("/updateSubject", auth,(req, res) => updateSubject(req, res));
subjectRouter.delete("/deleteSubject/:subject_Id",auth,(req,res) => deleteSubject(req,res));
subjectRouter.post("/updateSubjectStatus",auth,(req,res) => updateSubjectStatus(req,res));

export default subjectRouter;