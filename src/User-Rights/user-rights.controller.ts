import { Router } from "express";
import { addOrUpdateUserRight, getUserRightDetails, getUserRightId } from "./user-rights.service";

const userRightRouter = Router();

userRightRouter.post('/addOrUpdateUserRight',(req,res) =>addOrUpdateUserRight(req,res));
userRightRouter.get('/getUserRightId',(req,res)=>getUserRightId(req,res));
// userRightRouter.post("/updateUserRight",(req,res)=>updateUserRight(req,res));
userRightRouter.get('/getUserRightDetails/:userRightTypeId',(req,res)=>getUserRightDetails(req,res));
export default userRightRouter;
