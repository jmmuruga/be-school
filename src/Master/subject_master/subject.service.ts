import { appSource } from "../../core/database/db";
import { SubjectDto,Subjectvalidation } from "./subject.dto";
import { Request, Response } from "express";
import { SubjectMaster } from "./subject.model";
export const addSubject = async(req : Request , res :Response)=>{
    try{
        const payload : SubjectDto = req.body;

        const validation = Subjectvalidation.validate(payload); 
        if(validation.error){
            return res.status(400).json({
                message: validation.error.details[0].message
            })
        }
        const subjectRepository = appSource.getRepository(SubjectMaster);
        await subjectRepository.save(payload);
        return res.status(200).json({message : "Subject added successfully"})
    }
    catch(error){
        console.log(error)
    }
}