import { Router } from "express";
import { addStudentExamReport } from "./student-exam-report.service";
import { auth } from "../shared/helper";

const studentexamreportRouter =Router();
studentexamreportRouter.post("/addStudentExamReport",auth,(req,res)=> addStudentExamReport(req,res));

export default studentexamreportRouter;