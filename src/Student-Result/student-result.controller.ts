import { Router } from "express";
import { AddStudentScoreResult } from "./student-result.service";
const studentscoreRouter =Router();
studentscoreRouter.post('/AddstudentScoreResult',(req,res) =>AddStudentScoreResult(req,res));
export default studentscoreRouter;
