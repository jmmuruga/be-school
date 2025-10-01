import { Router } from "express";
import { addOnlinetest } from "./onlinetest.service";
const onlinetestRouter =Router();
onlinetestRouter.post('/addonlinetest',(req,res)=>addOnlinetest(req,res));
export default onlinetestRouter;