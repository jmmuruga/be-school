import { Router } from "express";
import { addSignup } from "./signup.service";
const signupRouter = Router();
signupRouter.post('/addSignup' , (req,res) => addSignup(req,res));

export default signupRouter;