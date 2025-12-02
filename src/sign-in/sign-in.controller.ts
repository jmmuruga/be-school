import { Router } from "express";
import { getStudentId, signIn, StudentSignIn } from "./sign-in.service";
const signInRouter = Router();
signInRouter.post('/signIn',(req,res)=>signIn(req,res));
signInRouter.post('/StudentSignIn',(req,res)=>StudentSignIn(req,res));
signInRouter.get('/getStudentId/:id', (req, res) => getStudentId(req, res));

export default signInRouter;