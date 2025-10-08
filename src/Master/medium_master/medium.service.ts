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
         const existingMedium = await mediumRepoistry.findOneBy({
                        medium: payload.medium,
    });

    if (existingMedium) {
      return res.status(400).json({
        message: "Medium already exists",
      });
    }
        await mediumRepoistry.save(payload);
        return res.status(200).json({message : "Medium added successfully"})
    }       
    catch(error){
        console.log(error)
    }
};
export const getMediumCode = async (req: Request, res: Response) => {
  try {
    const mediumRepositry = appSource.getRepository(MediumMaster);
    let mediumCode = await mediumRepositry.query(
      `SELECT mediumCode
            FROM [${process.env.DB_NAME}].[dbo].[medium_master] 
            Group by mediumCode
            ORDER BY CAST(mediumCode AS INT) DESC;`
    );
    let id = "0";
    if (mediumCode?.length > 0) {
      id = mediumCode[0].mediumCode;
    }
    const finalRes = Number(id) + 1;
    res.status(200).send({
      Result: finalRes,
    });
  } catch (error) {
    console.log(error);
  }
};
export const getMediumDetails = async (req:Request,res:Response) =>{
  try{
    const mediumRepoistry = appSource.getRepository(MediumMaster) ;
    const mediumM = await mediumRepoistry.createQueryBuilder("").getMany();
    res.status(200).send({
      Result: mediumM,
    });
    
  }catch(error){
    console.log(error);
  }
};
