import { Router } from "express";
import {
  addGroup,
  deleteGroup,
  getGroupId,
  getGroupMasterDetails,
  updateGroupMaster,
  updateGroupStatus,
} from "./group.service";

const groupRouter = Router();
groupRouter.post("/addGroup", (req, res) => addGroup(req, res));
groupRouter.get("/getGroupId", (req, res) => getGroupId(req, res));
groupRouter.get("/getGroupMasterDetails", (req, res) =>
  getGroupMasterDetails(req, res)
);
groupRouter.post("/updateGroupMaster", (req, res) =>
  updateGroupMaster(req, res)
);
groupRouter.delete("/deleteGroup/:Group_Id",(req,res) => deleteGroup(req,res));
export default groupRouter;
groupRouter.post("/updateGroupStatus",(req,res) => updateGroupStatus(req,res));

