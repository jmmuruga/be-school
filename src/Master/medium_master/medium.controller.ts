import { Router } from "express";
import { addMedium, getMediumCode, getMediumDetails, updateMedium } from "./medium.service";

const mediumRouter = Router();
mediumRouter.post('/addMedium' , (req,res) => addMedium(req,res));
mediumRouter.get("/getMediumCode", (req, res) => getMediumCode(req, res));
mediumRouter.get("/getMediumDetails",(req,res) => getMediumDetails(req,res));
mediumRouter.post('/updateMedium', (req, res)=> updateMedium(req, res));

export default mediumRouter;
