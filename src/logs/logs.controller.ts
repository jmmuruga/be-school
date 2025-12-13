import { Router } from "express";
import { getLogs, sendLogs } from "./logs.service";

const logsRouter = Router();
logsRouter.post('/addLogs' , (req, res) => sendLogs(req, res));
logsRouter.get('/getLog', (req,res) => getLogs(req,res));
export default logsRouter;