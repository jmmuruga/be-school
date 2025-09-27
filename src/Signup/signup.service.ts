import { appSource } from "../core/database/db";
import { SignupDto, SignupValidation } from "./signup.dto";
import { Request, Response } from "express";
import { Signup } from "./signup.model";
export const addSignup = async(req : Request , res :Response)=>{
    try{
        const payload : SignupDto = req.body;
        const validation = SignupValidation.validate(payload);
        if(validation.error){
            return res.status(400).json({
                message: validation.error.details[0].message
            })
        }
        const signupRepository = appSource.getRepository(Signup);
        await signupRepository.save(payload);
        return res.status(200).json({message : "Signup added successfully"})
    }
    catch(error){
        console.log(error)
    }

}
