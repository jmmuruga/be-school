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
         const existingSchool = await schoolRepoistry.findOneBy({
                        school: payload.school,
    });

    if (existingSchool) {
      return res.status(400).json({
        message: "School  already exists",
      });
    }
        await schoolRepoistry.save(payload);
        return res.status(200).json({message : "School added successfully"})
    }   
    catch(error){
        console.log(error)

    }
};
export const getSchoolCode = async (req: Request, res: Response) => {
  try {
    const schoolRepoistry = appSource.getRepository(SchoolMaster);
    let schoolCode = await schoolRepoistry.query(
      `SELECT schoolCode
            FROM [${process.env.DB_NAME}].[dbo].[school_master] 
            Group by schoolCode
            ORDER BY CAST(schoolCode AS INT) DESC;`
    );
    let id = "0";
    if (schoolCode?.length > 0) {
      id = schoolCode[0].schoolCode;
    }
    const finalRes = Number(id) + 1;
    res.status(200).send({
      Result: finalRes,
    });
  } catch (error) {
    console.log(error);
  }
};
