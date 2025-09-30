import { Router } from "express";
import { addQuestion } from "./questionpre.service";
const questionRouter = Router();
questionRouter.post('/addQuestion' , (req,res) => addQuestion(req,res));
export default questionRouter;
