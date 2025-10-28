import { Router } from "express";
import { addUser, deleteUser, getUserDetails, getUserId, updateUserLogin, updateUserStatus} from "./user.sevice";

const userRouter = Router();

userRouter.post('/addUser',(req,res) =>addUser(req,res));
userRouter.get('/getUserDetails',(req,res) =>getUserDetails(req,res));
userRouter.get('/getUserId',(req,res) =>getUserId(req,res));
userRouter.post("/updateUserLogin",(req,res) => updateUserLogin(req,res));
userRouter.delete("/deleteUser/:UserID",(req,res) => deleteUser(req,res));

export default userRouter;
userRouter.post("/updateUserStatus",(req,res) => updateUserStatus(req,res));