import { appSource } from "../../core/database/db";
import { GroupDto, GroupValidation } from "./group.dto";
import { Request, Response } from "express";
import { GroupMaster } from "./group.model";
import { Not } from "typeorm";

export const getGroupMasterDetails = async (req: Request, res: Response) => {
  try {
    const groupRepoistry = appSource.getRepository(GroupMaster);
    const groupM = await groupRepoistry.createQueryBuilder("").getMany();
    res.status(200).send({
      Result: groupM,
    });
  } catch (error) {
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
export const updateGroupMaster = async (req: Request, res: Response) => {
  try {
    const payload: GroupDto = req.body;
    const validation = GroupValidation.validate(payload);
    if (validation.error) {
      console.log(validation.error, "Validation Error");
      return res.status(400).json({
        message: validation.error.details[0].message,
      });
    }
    // check whether class exist
    const groupRepository = appSource.getRepository(GroupMaster);
    const existingClass = await groupRepository.findOneBy({
      groupCode: payload.groupCode,
    });
    if (!existingClass) {
      return res.status(400).json({
        message: "Group Doesn't exist",
      });
    }
    // check name  already exist
    const nameExist = await groupRepository.findBy({
      groupName: payload.groupName,
      groupoption: payload.groupoption,
      groupDescription: payload.groupDescription,
      groupCode: Not(payload.groupCode),
    });
    if (nameExist.length > 0) {
      return res.status(400).json({
        message: "Group Name Already Exist",
      });
    }
    await groupRepository.update({ groupCode: payload.groupCode }, payload);
    return res.status(200).json({ message: "Group Updated successfully" });
  } catch (error) {
    console.error("Update Error:", error);
    return res.status(500).json({
      message: "Internal server error",
      error: error instanceof Error ? error.message : error,
    });
  }
};
