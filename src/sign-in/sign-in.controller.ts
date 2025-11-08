import { Router } from "express";
import { getDetails, signIn, StudentSignIn } from "./sign-in.service";
const signInRouter = Router();
signInRouter.post('/signIn',(req,res)=>signIn(req,res));
signInRouter.post('/StudentSignIn',(req,res)=>StudentSignIn(req,res));

export default signInRouter;