import { Router } from "express";

import {
  addClass,
  deleteClass,
  getClasMasterDetails,
  getClassId,
  updateClassMaster,
  updateStatusClass,
} from "./class.service";
import { auth } from "../../shared/helper";

const classRouter = Router();

classRouter.post("/addClass", auth,(req, res) => addClass(req, res));
classRouter.get("/getClassId",auth, (req, res) => getClassId(req, res));
classRouter.post("/updateClassMaster",auth, (req, res) =>
  updateClassMaster(req, res)
);
classRouter.get("/getClasMasterDetails", auth,(req, res) =>
  getClasMasterDetails(req, res)
);
classRouter.delete("/deleteClass/:Class_Id",auth,(req,res) => deleteClass(req,res));
classRouter.post("/updateStatusClass",auth,(req,res) => updateStatusClass(req,res));
export default classRouter;