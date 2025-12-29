import { Router } from "express";
import { addObjectiveques } from "./objective-question.service";

const objectquesRouter = Router();
objectquesRouter.post("/addObjectiveques", (req, res) =>
  addObjectiveques(req, res)
);

export default objectquesRouter;
