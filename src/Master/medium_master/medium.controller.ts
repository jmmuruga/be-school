import { Router } from "express";
import { addMedium, deleteMedium, getMediumCode, getMediumDetails, updateMedium, updateMediumStatus } from "./medium.service";

const mediumRouter = Router();
mediumRouter.post('/addMedium' , (req,res) => addMedium(req,res));
mediumRouter.get("/getMediumCode", (req, res) => getMediumCode(req, res));
mediumRouter.get("/getMediumDetails",(req,res) => getMediumDetails(req,res));
mediumRouter.post('/updateMedium', (req, res)=> updateMedium(req, res));
mediumRouter.delete("/deleteMedium/:mediumCode",(req,res) => deleteMedium(req,res));
// mediumRouter.delete("/deleteMedium/: mediumCode" (req,res) => deleteMedium(req,res));

export default mediumRouter;
mediumRouter.post("/updateMediumStatus",(req,res) => updateMediumStatus(req,res));