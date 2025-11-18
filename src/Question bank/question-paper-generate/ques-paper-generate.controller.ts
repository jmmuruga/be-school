import { Router } from "express";
import { addQuesgene, getObjectiveQuestions } from "./ques-paper-generate.service";
const QuesGenerateRouter = Router();
QuesGenerateRouter.post('/addQuesgene',(req,res) =>addQuesgene(req,res));
QuesGenerateRouter.get('/getObjectiveQuestions/:subject/:standard/:type/:scheme',(req,res)=>getObjectiveQuestions(req,res))
export default QuesGenerateRouter;