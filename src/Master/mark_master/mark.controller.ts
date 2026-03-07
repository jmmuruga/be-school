import { Router } from "express";
import {
  addMark,
  deleteMarks,
  getMarkId,
  getMarkMasterDetails,
  updateMark,
  updateMarkStatus,
} from "./mark.service";
import { deleteClass } from "../class_master/class.service";
import { auth } from "../../shared/helper";

const markRouter = Router();
markRouter.post("/addMark", (req, res) => addMark(req, res));
markRouter.get("/getMarkId",auth, (req, res) => getMarkId(req, res));
markRouter.get("/getMarkMasterDetails",auth, (req, res) =>
  getMarkMasterDetails(req, res)
);
markRouter.post("/updateMark", auth,(req, res) => updateMark(req, res));
markRouter.post("/updateMarkStatus",auth,(req,res) => updateMarkStatus(req,res));
markRouter.delete("/deleteMarks/:mark_Id",auth, (req, res) => deleteMarks(req, res));

export default markRouter;