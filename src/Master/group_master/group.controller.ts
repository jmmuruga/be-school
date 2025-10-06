import { Router } from "express";
import { addGroup } from "./group.service";

const groupRouter = Router();
groupRouter.post('/addGroup' , (req,res) => addGroup(req,res));
// groupRouter.get('/getGroup' , (req,res) => getGroup(req,res));

export default groupRouter;