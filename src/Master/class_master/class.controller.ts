import { Router } from "express";
import {
  addClass,
  deleteClass,
  getClasMasterDetails,
  getClassId,
  updateClassMaster,
  updateStatusClass,
} from "./class.service";

const classRouter = Router();

classRouter.post("/addClass", (req, res) => addClass(req, res));
classRouter.get("/getClassId", (req, res) => getClassId(req, res));
classRouter.post("/updateClassMaster", (req, res) =>
  updateClassMaster(req, res)
);
classRouter.get("/getClasMasterDetails", (req, res) =>
  getClasMasterDetails(req, res)
);
classRouter.delete("/deleteClass/:Class_Id",(req,res) => deleteClass(req,res));
export default classRouter;
classRouter.post("/updateStatusClass",(req,res) => updateStatusClass(req,res));