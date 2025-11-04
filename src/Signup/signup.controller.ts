import { Router } from "express";
import { addSignup, getDetails } from "./signup.service";
const signupRouter = Router();
signupRouter.post('/addSignup' , (req,res) => addSignup(req,res));
signupRouter.get("/getDetails",(req,res) => getDetails(req,res));
export default signupRouter;