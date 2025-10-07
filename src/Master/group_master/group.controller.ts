import { Router } from "express";
import { addGroup, getGroupCode } from "./group.service";

const groupRouter = Router();
groupRouter.post("/addGroup", (req, res) => addGroup(req, res));
groupRouter.get("/getGroupCode", (req, res) => getGroupCode(req, res));

export default groupRouter;
