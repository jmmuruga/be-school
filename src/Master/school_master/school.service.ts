import { appSource } from "../../core/database/db";
import { SchoolDto, SchoolValidation } from "./school.dto";
import { Request, Response } from "express";
import { SchoolMaster } from "./school.model";
export const addSchool = async(req : Request , res :Response)=>{
    try{
        const payload : SchoolDto = req.body;
        const validation = SchoolValidation.validate(payload);
        if(validation.error){
            return res.status(400).json({   
                message: validation.error.details[0].message
            })
        }   
        const schoolRepoistry = appSource.getRepository(SchoolMaster);
        await schoolRepoistry.save(payload);
        return res.status(200).json({message : "School added successfully"})
    }   
    catch(error){

        console.log(error)

    }
}
