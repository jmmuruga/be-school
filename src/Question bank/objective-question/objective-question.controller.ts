import { Router } from "express";
import { addObjectiveques } from "./objective-question.service";
import { auth } from "../../shared/helper";

const objectquesRouter = Router();
objectquesRouter.post("/addObjectiveques",auth,(req, res) =>
  addObjectiveques(req, res)
);

export default objectquesRouter;
