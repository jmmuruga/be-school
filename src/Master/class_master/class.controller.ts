import { Router } from "express";
import {
  addClass,
  // deleteClassMasterData,
  getClasMasterDetails,
  getClassCode,
  updateClassMaster,
} from "./class.service";

const classRouter = Router();

classRouter.post("/addClass", (req, res) => addClass(req, res));
classRouter.get("/getClassCode", (req, res) => getClassCode(req, res));
classRouter.post("/updateClassMaster", (req, res) =>
  updateClassMaster(req, res)
);
classRouter.get("/getClasMasterDetails", (req, res) =>
  getClasMasterDetails(req, res)
);
// classRouter.delete("/deleteClassMasterData/:classCode",(req,res) => deleteClassMasterData(req,res));
export default classRouter;
