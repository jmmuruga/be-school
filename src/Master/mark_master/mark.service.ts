import { appSource } from "../../core/database/db";
import { MarkDto,MarkValidation } from "./mark.dto";
import { Request, Response } from "express";
import { MarkMaster } from "./mark.model";
export const addMark = async(req : Request , res :Response)=>{
    try{
        const payload : MarkDto = req.body; 
        const validation = MarkValidation.validate(payload);
        if(validation.error){
            return res.status(400).json({
                message: validation.error.details[0].message
            })
        }

        const markRepository = appSource.getRepository(MarkMaster);
        await markRepository.save(payload);
        return res.status(200).json({message : "Mark added successfully"})
    }
    catch(error){
        console.log(error)
    }
}
