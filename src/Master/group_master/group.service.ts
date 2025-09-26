import { appSource } from "../../core/database/db";
import { GroupDto, GroupValidation } from "./group.dto";
import { Request, Response } from "express";
import { GroupMaster } from "./group.model";
export const addGroup = async(req : Request , res :Response)=>{
    try{
        const payload : GroupDto = req.body;        
        const validation = GroupValidation.validate(payload);
        if(validation.error){
            return res.status(400).json({
                message: validation.error.details[0].message
            })
        }
        const groupRepoistry = appSource.getRepository(GroupMaster);
        await groupRepoistry.save(payload);
        return res.status(200).json({message : "Group added successfully"})
    }
    catch(error){
        console.log(error)
    
    }
}   