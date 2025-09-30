import { Router } from "express";
import { addUser } from "./user.sevice";

const userRouter = Router();

userRouter.post('/addUser',(req,res) =>addUser(req,res));

export default userRouter;