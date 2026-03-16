import { Router } from "express";
import { addUser, deleteUser, getUserDetails, getUserId, updateUserLogin, updateUserStatus} from "./user.sevice";
import { auth } from "../shared/helper";

const userRouter = Router();

userRouter.post('/addUser',auth,(req,res) =>addUser(req,res));
userRouter.get('/getUserDetails',auth,(req,res) =>getUserDetails(req,res));
userRouter.get('/getUserId',auth,(req,res) =>getUserId(req,res));
userRouter.post("/updateUserLogin",auth,(req,res) => updateUserLogin(req,res));
userRouter.delete("/deleteUser/:UserID",auth,(req,res) => deleteUser(req,res));
userRouter.post("/updateUserStatus",auth,(req,res) => updateUserStatus(req,res));

export default userRouter;