import { Router } from "express";
import {
  addStream,
  deleteStream,
  getStreamId,
  getStreamDetails,
  updateStream,
  updateStreamStatus,
} from "./medium.service";
import { auth } from "../../shared/helper";

const StreamRouter = Router();
StreamRouter.post("/addStream", auth, (req, res) => addStream(req, res));
StreamRouter.get("/getStreamId", auth, (req, res) => getStreamId(req, res));
StreamRouter.get("/getStreamDetails", auth, (req, res) =>
  getStreamDetails(req, res),
);
StreamRouter.get("/getStreamDetail", (req, res) => getStreamDetails(req, res));

StreamRouter.post("/updateStream", auth, (req, res) => updateStream(req, res));
StreamRouter.delete("/deleteStream/:Stream_Id", auth, (req, res) =>
  deleteStream(req, res),
);
// StreamRouter.delete("/deleteStream/: Streamid" (req,res) => deleteStream(req,res));
StreamRouter.post("/updateStreamStatus", auth, (req, res) =>
  updateStreamStatus(req, res),
);

export default StreamRouter;
