import { appSource } from "../../core/database/db";
import { MediumDto, MediumValidation } from "./medium.dto";
import { Request, Response } from "express";
import { MediumMaster } from "./medium.model";
export const addMedium = async(req : Request , res :Response)=>{
    try{
        const payload : MediumDto = req.body;
        const validation = MediumValidation.validate(payload);
        if(validation.error){
            return res.status(400).json({
                message: validation.error.details[0].message
            })
        }   
        const mediumRepoistry = appSource.getRepository(MediumMaster);
        await mediumRepoistry.save(payload);
        return res.status(200).json({message : "Medium added successfully"})
    }       
    catch(error){
        console.log(error)
    }
}