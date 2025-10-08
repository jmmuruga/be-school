import { Router } from "express";
import { addMark, getMarkCode, getMarkMasterDetails } from "./mark.service";

const markRouter = Router();
markRouter.post("/addMark", (req, res) => addMark(req, res));
markRouter.get("/getMarkCode", (req, res) => getMarkCode(req, res));
markRouter.get("/getMarkMasterDetails", (req, res) => getMarkMasterDetails(req, res));
export default markRouter;
