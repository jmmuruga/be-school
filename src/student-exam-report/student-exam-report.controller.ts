import { Router } from "express";
import { addStudentExamReport } from "./student-exam-report.service";

const studentexamreportRouter =Router();
studentexamreportRouter.post("/addStudentExamReport",(req,res)=> addStudentExamReport(req,res));

export default studentexamreportRouter;