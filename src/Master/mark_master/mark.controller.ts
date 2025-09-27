import { Router } from "express";
import { addMark } from "./mark.service";

const markRouter = Router();
markRouter.post("/addMark",(req,res)=> addMark(req,res));
export default markRouter;
