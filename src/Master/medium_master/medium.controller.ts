import { Router } from "express";
import { addMedium, deleteMedium, getMediumId, getMediumDetails, updateMedium, updateMediumStatus } from "./medium.service";

const mediumRouter = Router();
mediumRouter.post('/addMedium' , (req,res) => addMedium(req,res));
mediumRouter.get("/getMediumId", (req, res) => getMediumId(req, res));
mediumRouter.get("/getMediumDetails",(req,res) => getMediumDetails(req,res));
mediumRouter.post('/updateMedium', (req, res)=> updateMedium(req, res));
mediumRouter.delete("/deleteMedium/:medium_Id",(req,res) => deleteMedium(req,res));
// mediumRouter.delete("/deleteMedium/: mediumid" (req,res) => deleteMedium(req,res));

export default mediumRouter;
mediumRouter.post("/updateMediumStatus",(req,res) => updateMediumStatus(req,res));