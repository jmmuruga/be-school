import { Router } from "express";
import { addOnlinetest, getObjectiveQuestions, getStudentId } from "./onlinetest.service";
const onlinetestRouter =Router();
onlinetestRouter.post('/addonlinetest',(req,res)=>addOnlinetest(req,res));
onlinetestRouter.get('/getStudentId/:id', (req, res) => getStudentId(req, res));
onlinetestRouter.get('/getObjectiveQuestions/:subjectName_Id/:ClassName_Id/:type/:question/:Stream_Id',(req,res)=>getObjectiveQuestions(req,res));

export default onlinetestRouter;