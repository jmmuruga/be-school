import { Router } from "express";
import { AddStudentScoreResult, AddTryAgainLog } from "./student-result.service";
import { getStudentScoreResult } from "./student-result.service";
const studentscoreRouter =Router();
studentscoreRouter.post('/AddstudentScoreResult',(req,res) =>AddStudentScoreResult(req,res));
studentscoreRouter.post('/AddTryAgainLog',(req,res) =>AddTryAgainLog(req,res));
studentscoreRouter.get('/getStudentScoreResult',(req,res) =>getStudentScoreResult(req,res));
export default studentscoreRouter;
