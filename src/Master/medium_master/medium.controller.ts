import { Router } from "express";
import { addStream, deleteStream, getStreamId, getStreamDetails, updateStream, updateStreamStatus } from "./medium.service";

const StreamRouter = Router();
StreamRouter.post('/addStream' , (req,res) => addStream(req,res));
StreamRouter.get("/getStreamId", (req, res) => getStreamId(req, res));
StreamRouter.get("/getStreamDetails",(req,res) => getStreamDetails(req,res));
StreamRouter.post('/updateStream', (req, res)=> updateStream(req, res));
StreamRouter.delete("/deleteStream/:Stream_Id",(req,res) => deleteStream(req,res));
// StreamRouter.delete("/deleteStream/: Streamid" (req,res) => deleteStream(req,res));
StreamRouter.post("/updateStreamStatus",(req,res) => updateStreamStatus(req,res));

export default StreamRouter;
