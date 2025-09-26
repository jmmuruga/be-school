import { appSource } from "../../core/database/db";
import { ClassDto, ClassValidation } from "./class.dto";
import { Request, Response } from "express";
import { classMaster } from "./class.model";

export const addClass = async(req : Request , res :Response)=>{
    try{
        const payload : ClassDto = req.body;
        const validation = ClassValidation.validate(payload);
        if(validation.error){
            return res.status(400).json({
                message: validation.error.details[0].message
            })
        }
        const classRepoistry = appSource.getRepository(classMaster);
        await classRepoistry.save(payload);
        return res.status(200).json({message : "Class added successfully"})

    }
    catch(error){
        console.log(error)
    }
}