import { appSource } from "../core/database/db";
import { Request, Response } from "express";
import { onlinetest } from "./onlinetest.model";
import { onlinetestDto, OnlineTestValidation } from "./onlinetest.dto";
export const addOnlinetest = async(req:Request,res:Response) =>{
       try{
           const payload : onlinetestDto = req.body;
           const validation = OnlineTestValidation.validate(payload);
           if(validation.error){
               return res.status(400).json({
                   message: validation.error.details[0].message
               })
           }
           const onlinetestRepoistry = appSource.getRepository(onlinetest);
           // Convert Numofquestion to number if it exists
           const savePayload = {
               ...payload,
               Numofquestion: payload.Numofquestion ? Number(payload.Numofquestion) : undefined
           };
           await onlinetestRepoistry.save(savePayload);
           return res.status(200).json({message : "onlinetest added successfully"})
   
       }
       catch(error){
           console.log(error)
       }
}