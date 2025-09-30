import { Router } from "express";
import { addQuesgene } from "./ques-paper-generate.service";
const QuesGenerateRouter = Router();
QuesGenerateRouter.post('/addQuesgene',(req,res) =>addQuesgene(req,res));
export default QuesGenerateRouter;