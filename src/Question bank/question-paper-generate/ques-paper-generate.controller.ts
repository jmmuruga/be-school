import { Router } from "express";
import { addQuesgene, getObjectiveQuestions, getQuestionAns } from "./ques-paper-generate.service";
const QuesGenerateRouter = Router();
QuesGenerateRouter.post('/addQuesgene',(req,res) =>addQuesgene(req,res));
QuesGenerateRouter.get('/getObjectiveQuestions/:subject/:standard/:type/:question/:oneMax',(req,res)=>getObjectiveQuestions(req,res));
QuesGenerateRouter.get('/getQuestionAns/:subject/:standard/:type/:twomark/:threemark/:fivemark/:twoMax/:threeMax/:fiveMax',(req,res)=>getQuestionAns(req,res));
export default QuesGenerateRouter;