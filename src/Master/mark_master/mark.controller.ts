import { Router } from "express";
import {
  addMark,
  deleteMarks,
  getMarkCode,
  getMarkMasterDetails,
  updateMark,
  updateMarkStatus,
} from "./mark.service";
import { deleteClass } from "../class_master/class.service";

const markRouter = Router();
markRouter.post("/addMark", (req, res) => addMark(req, res));
markRouter.get("/getMarkCode", (req, res) => getMarkCode(req, res));
markRouter.get("/getMarkMasterDetails", (req, res) =>
  getMarkMasterDetails(req, res)
);
markRouter.post("/updateMark", (req, res) => updateMark(req, res));
export default markRouter;
markRouter.delete("/deleteMarks/:markCode", (req, res) => deleteMarks(req, res));
markRouter.post("/updateMarkStatus",(req,res) => updateMarkStatus(req,res));