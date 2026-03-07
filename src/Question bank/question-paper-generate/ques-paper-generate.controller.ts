import { Router } from "express";
import { addQuesgene, getObjectiveQuestions, getQuestionAns } from "./ques-paper-generate.service";
import { auth } from "../../shared/helper";
const QuesGenerateRouter = Router();
QuesGenerateRouter.post('/addQuesgene',auth,(req,res) =>addQuesgene(req,res));
QuesGenerateRouter.get('/getObjectiveQuestions/:subjectName_Id/:ClassName_Id/:type/:question/:oneMax',auth,(req,res)=>getObjectiveQuestions(req,res));
QuesGenerateRouter.get('/getQuestionAns/:subjectName_Id/:ClassName_Id/:type/:twomark/:threemark/:fivemark/:twoMax/:threeMax/:fiveMax',auth,(req,res)=>getQuestionAns(req,res));
export default QuesGenerateRouter;