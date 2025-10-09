import { Router } from "express";
import {
  addGroup,
  getGroupCode,
  getGroupMasterDetails,
  updateGroupMaster,
} from "./group.service";

const groupRouter = Router();
groupRouter.post("/addGroup", (req, res) => addGroup(req, res));
groupRouter.get("/getGroupCode", (req, res) => getGroupCode(req, res));
groupRouter.get("/getGroupMasterDetails", (req, res) =>
  getGroupMasterDetails(req, res)
);
groupRouter.post("/updateGroupMaster", (req, res) =>
  updateGroupMaster(req, res)
);
export default groupRouter;
