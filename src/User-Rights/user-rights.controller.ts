import { Router } from "express";
import { addOrUpdateUserRight, getUserRightDetails, getUserRightId } from "./user-rights.service";
import { auth } from "../shared/helper";

const userRightRouter = Router();

userRightRouter.post('/addOrUpdateUserRight',auth,(req,res) =>addOrUpdateUserRight(req,res));
userRightRouter.get('/getUserRightId',auth,(req,res)=>getUserRightId(req,res));
// userRightRouter.post("/updateUserRight",(req,res)=>updateUserRight(req,res));
userRightRouter.get('/getUserRightDetails/:userRightTypeId',auth,(req,res)=>getUserRightDetails(req,res));
export default userRightRouter;
