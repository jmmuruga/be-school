import { Router } from "express";
import {
  addSchool,
  deleteSchool,
  getSchoolId,
  getSchoolDetails,
  updateSchool,
  updateSchoolStatus,
} from "./school.service";
import { auth } from "../../shared/helper";

const schoolRouter = Router();
schoolRouter.post("/addSchool", auth,(req, res) => addSchool(req, res));
schoolRouter.get("/getSchoolId",auth, (req, res) => getSchoolId(req, res));
schoolRouter.get("/getSchoolDetails",auth, (req, res) => getSchoolDetails(req, res));
schoolRouter.post("/updateSchool", auth,(req, res) => updateSchool(req, res));
schoolRouter.delete("/deleteSchool/:school_Id",auth, (req, res) =>
  deleteSchool(req, res)
);
schoolRouter.post("/updateSchoolStatus",auth, (req, res) =>
  updateSchoolStatus(req, res)
);
export default schoolRouter;

