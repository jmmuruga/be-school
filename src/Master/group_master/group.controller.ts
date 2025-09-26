import { Router } from "express";
import { addGroup } from "./group.service";

const groupRouter = Router();
groupRouter.post('/addGroup' , (req,res) => addGroup(req,res));

export default groupRouter;