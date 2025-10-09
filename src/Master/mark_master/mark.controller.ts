import { Router } from "express";
import {
  addMark,
  getMarkCode,
  getMarkMasterDetails,
  updateMark,
} from "./mark.service";

const markRouter = Router();
markRouter.post("/addMark", (req, res) => addMark(req, res));
markRouter.get("/getMarkCode", (req, res) => getMarkCode(req, res));
markRouter.get("/getMarkMasterDetails", (req, res) =>
  getMarkMasterDetails(req, res)
);
markRouter.post("/updateMark", (req, res) => updateMark(req, res));
export default markRouter;
