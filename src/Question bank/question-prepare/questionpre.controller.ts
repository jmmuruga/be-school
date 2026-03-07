import { Router } from "express";
import { addQuestion } from "./questionpre.service";
import { auth } from "../../shared/helper";
const questionRouter = Router();
questionRouter.post('/addQuestion',auth, (req,res) => addQuestion(req,res));
export default questionRouter;
