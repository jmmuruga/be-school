import { appSource } from "../../core/database/db";
import { GroupDto, GroupValidation } from "./group.dto";
import { Request, Response } from "express";
import { GroupMaster } from "./group.model";


export const  getGroupMasterDetails = async (req: Request, res: Response) => {
  try{
    const groupRepoistry =appSource.getRepository(GroupMaster);
    const groupM = await groupRepoistry.createQueryBuilder("").getMany();
    res.status(200).send({
      Result: groupM,
    });
  }
  catch(error){
    console.log(error);
  }
};

export const addGroup = async (req: Request, res: Response) => {
  try {
    const payload: GroupDto = req.body;
    const validation = GroupValidation.validate(payload);
    if (validation.error) {
      return res.status(400).json({
        message: validation.error.details[0].message,
      });
    }
    const groupRepoistry = appSource.getRepository(GroupMaster);
    await groupRepoistry.save(payload);
    return res.status(200).json({ message: "Group added successfully" });
  } catch (error) {
    console.log(error);
  }
};

export const getGroupCode = async (req: Request, res: Response) => {
  try {
    const groupRepositry = appSource.getRepository(GroupMaster);
    let groupCode = await groupRepositry.query(
      `SELECT groupCode
            FROM [${process.env.DB_NAME}].[dbo].[group_master] 
            Group by groupCode
            ORDER BY CAST(groupCode AS INT) DESC;`
    );
    let id = "0";
    if (groupCode?.length > 0) {
      id = groupCode[0].groupCode;
    }
    const finalRes = Number(id) + 1;
    res.status(200).send({
      Result: finalRes,
    });
  } catch (error) {
    console.log(error);
  }
};
