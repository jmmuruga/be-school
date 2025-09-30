import { Request, Response } from "express";
import { appSource } from "../../core/database/db";
import { QuesgenerateValidation } from "./ques-paper-generate.dto";
import { Quesgenerate } from "./ques-paper-generate.model";
import { QuesgenerateDto } from "./ques-paper-generate.dto";
export const addQuesgene = async(req : Request , res :Response)=>{
    try{
        const payload : QuesgenerateDto = req.body;
        const validation = QuesgenerateValidation.validate(payload);
        if(validation.error){
            return res.status(400).json({
                message: validation.error.details[0].message
            })
        }
        const QuesgenerateRepository = appSource.getRepository(Quesgenerate);
        await QuesgenerateRepository.save(payload);
        return res.status(200).json({message : "QuesGenerate added successfully"})
    }
    catch(error){
        console.log(error)
    }

}