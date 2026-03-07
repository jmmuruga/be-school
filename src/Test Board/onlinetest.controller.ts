import { Router } from "express";
import { addOnlinetest, getObjectiveQuestions, getStudentId } from "./onlinetest.service";
import { auth } from "../shared/helper";
const onlinetestRouter =Router();
onlinetestRouter.post('/addonlinetest',auth,(req,res)=>addOnlinetest(req,res));
onlinetestRouter.get('/getStudentId/:id', auth,(req, res) => getStudentId(req, res));
// Without mode
onlinetestRouter.get(
  '/getObjectiveQuestions/:subjectName_Id/:ClassName_Id/:type/:question/:Stream_Id/:studentId',auth,
  (req,res)=>getObjectiveQuestions(req,res)
);
// With mode
onlinetestRouter.get(
  '/getObjectiveQuestions/:subjectName_Id/:ClassName_Id/:type/:question/:Stream_Id/:studentId/:mode',auth,
  (req,res)=>getObjectiveQuestions(req,res)
);
export default onlinetestRouter;