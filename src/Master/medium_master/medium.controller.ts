import { Router } from "express";
import { addMedium } from "./medium.service";

const mediumRouter = Router();
mediumRouter.post('/addMedium' , (req,res) => addMedium(req,res));
export default mediumRouter;
