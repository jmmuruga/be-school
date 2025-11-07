import { Router } from "express";
import { signIn } from "./sign-in.service";
const signInRouter = Router();
signInRouter.post('/signIn',(req,res)=>signIn(req,res));
export default signInRouter;