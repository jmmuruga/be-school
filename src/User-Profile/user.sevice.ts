import { UserDto,UserValidation } from "./user.dto";
import { Request,Response } from "express";
import { User } from "./user.model";
import { appSource } from "../core/database/db";
export const addUser = async(req : Request , res :Response)=>{
    try{
        const payload : UserDto = req.body;
        const validation = UserValidation.validate(payload);
        if(validation.error){
            return res.status(400).json({
                message: validation.error.details[0].message
            })
        }
        const userRepoistry = appSource.getRepository(User);
        await userRepoistry.save(payload);
        return res.status(200).json({message : "User added successfully"})

    }
    catch(error){
        console.log(error)
    }
}