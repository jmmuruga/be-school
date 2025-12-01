import { Router } from "express";
import { addOnlinetest, getStudentId } from "./onlinetest.service";
const onlinetestRouter =Router();
onlinetestRouter.post('/addonlinetest',(req,res)=>addOnlinetest(req,res));
onlinetestRouter.get('/getStudentId/:id', (req, res) => getStudentId(req, res));
export default onlinetestRouter;