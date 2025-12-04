import { Router } from "express";
import { addUserRight, getUserRightDetails, getUserRightId, updateUserRight } from "./user-rights.service";

const userRightRouter = Router();

userRightRouter.post('/addUserRight',(req,res) =>addUserRight(req,res));
userRightRouter.get('/getUserRightId',(req,res)=>getUserRightId(req,res));
userRightRouter.post("/updateUserRight",(req,res)=>updateUserRight(req,res));
userRightRouter.get('/getUserRightDetails',(req,res)=>getUserRightDetails(req,res));
export default userRightRouter;
