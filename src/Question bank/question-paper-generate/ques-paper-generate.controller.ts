import { Router } from "express";
import { addQuesgene, getObjectiveQuestions, getQuestionAns } from "./ques-paper-generate.service";
const QuesGenerateRouter = Router();
QuesGenerateRouter.post('/addQuesgene',(req,res) =>addQuesgene(req,res));
QuesGenerateRouter.get('/getObjectiveQuestions/:subjectName_Id/:ClassName_Id/:type/:question/:oneMax',(req,res)=>getObjectiveQuestions(req,res));
QuesGenerateRouter.get('/getQuestionAns/:subjectName_Id/:ClassName_Id/:type/:twomark/:threemark/:fivemark/:twoMax/:threeMax/:fiveMax',(req,res)=>getQuestionAns(req,res));
export default QuesGenerateRouter;