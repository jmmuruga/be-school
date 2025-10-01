import { Router } from "express";
import { addObjectiveques } from "./objective-question.service";

const objectquesRouter = Router();
objectquesRouter.post('/addQuestionques', (req, res) => addObjectiveques(req, res));
export default  objectquesRouter;