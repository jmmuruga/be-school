import { Router } from "express";
import { addUser, getUserDetails, getUserId} from "./user.sevice";

const userRouter = Router();

userRouter.post('/addUser',(req,res) =>addUser(req,res));
userRouter.get('/getUserDetails',(req,res) =>getUserDetails(req,res));
userRouter.get('/getUserId',(req,res) =>getUserId(req,res));
export default userRouter;