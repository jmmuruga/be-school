import { Router } from "express";
import {
  addGroup,
  deleteGroup,
  getGroupId,
  getGroupMasterDetails,
  updateGroupMaster,
  updateGroupStatus,
} from "./group.service";
import { auth } from "../../shared/helper";

const groupRouter = Router();
groupRouter.post("/addGroup", auth,(req, res) => addGroup(req, res));
groupRouter.get("/getGroupId", auth,(req, res) => getGroupId(req, res));
groupRouter.get("/getGroupMasterDetails",auth, (req, res) =>
  getGroupMasterDetails(req, res)
);
groupRouter.post("/updateGroupMaster",auth, (req, res) =>
  updateGroupMaster(req, res)
);
groupRouter.delete("/deleteGroup/:Group_Id",auth,(req,res) => deleteGroup(req,res));
groupRouter.post("/updateGroupStatus",auth,(req,res) => updateGroupStatus(req,res));

export default groupRouter;

