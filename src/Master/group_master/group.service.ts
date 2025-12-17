import { appSource } from "../../core/database/db";
import { GroupDto, groupStatus, GroupValidation } from "./group.dto";
import { Request, Response } from "express";
import { GroupMaster } from "./group.model";
import { Not } from "typeorm";
import { logsDto } from "../../logs/logs.dto";
import { InsertLog } from "../../logs/logs.service";

export const getGroupMasterDetails = async (req: Request, res: Response) => {
  try {
    const groupRepoistry = appSource.getRepository(GroupMaster);
    const groupM = await groupRepoistry.find({
      where: { isActive: true },
    });
    // const groupM = await groupRepoistry.createQueryBuilder("").getMany();
    res.status(200).send({
      Result: groupM,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Internal server error",
      error: error instanceof Error ? error.message : error,
    });
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
    // check data whether existing
    const groupRepoistry = appSource.getRepository(GroupMaster);
    const existingClass = await groupRepoistry.findOneBy({
      groupName: payload.groupName,
      groupoption: payload.groupoption,
    });

    if (existingClass) {
      return res.status(400).json({
        ErrorMessage: "Group Name already exists",
      });
    }
    await groupRepoistry.save(payload);
    const logsPayload: logsDto = {
      UserId: Number(payload.created_UserId),
      UserName: null,
      statusCode: 200,
      Message: `Group Added  Successfully By - `,
    };
    await InsertLog(logsPayload);
    return res.status(200).json({ IsSuccess: "Group Added Successfully !!" });
  } catch (error) {
    return res.status(500).json({
      message: "Internal server error",
      error: error instanceof Error ? error.message : error,
    });
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
    return res.status(500).json({
      message: "Internal server error",
      error: error instanceof Error ? error.message : error,
    });
    // console.log(error);
  }
};
export const updateGroupMaster = async (req: Request, res: Response) => {
  try {
    const payload: GroupDto = req.body;
    const validation = GroupValidation.validate(payload);
    if (validation.error) {
      return res.status(400).json({
        message: validation.error.details[0].message,
      });
    }
    // check whether class exist
    const groupRepository = appSource.getRepository(GroupMaster);
    const existingGroup = await groupRepository.findBy({
      groupCode: payload.groupCode,
    });
    if (!existingGroup) {
      return res.status(400).json({
        ErrorMessage: "Group Already exist",
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
        ErrorMessage: "Group Name Already Exist",
      });
    }
    await groupRepository.update({ groupCode: payload.groupCode }, payload);

    const logsPayload: logsDto = {
      UserId: Number(payload.created_UserId),
      UserName: null,
      statusCode: 200,
      Message: `Group Updated Successfully By - `,
    };
    await InsertLog(logsPayload);
    return res.status(200).json({ IsSuccess: "Group Updated successfully !!" });
  } catch (error) {
    return res.status(500).json({
      message: "Internal server error",
      error: error instanceof Error ? error.message : error,
    });
  }
};
export const deleteGroup = async (req: Request, res: Response) => {
  try {
    const groupCode = Number(req.params.groupCode);
    const { loginUserId, loginUserName } = req.body;

    if (isNaN(groupCode)) {
      return res.status(400).json({
        message: "GroupCode not found",
      });
    }
    const groupRepository = appSource.getRepository(GroupMaster);
    // Check whether groupcode exists
    const existingGroup = await groupRepository.findOneBy({
      groupCode: groupCode,
    });
    if (!existingGroup) {
      return res.status(404).json({
        ErrorMessage: "GroupCode  not found",
      });
    }
    await groupRepository
      .createQueryBuilder()
      .delete()
      .update(GroupMaster)
      .set({ isActive: false })
      .where({ groupCode: groupCode })
      .execute();

    const logsPayload: logsDto = {
      UserId: loginUserId,
      UserName: loginUserName,
      statusCode: 200,
      Message: `Deleted GroupMaster  ${existingGroup.groupName}  By - `,
    };
    await InsertLog(logsPayload);

    // await groupRepository.delete(groupCode);
    return res.status(200).json({
      IsSuccess: "Group Deleted Successfully !!",
    });
  } catch (error) {
    return res.status(500).json({
      message: "Internal server error",
      error: error instanceof Error ? error.message : error,
    });
  }
};
export const updateGroupStatus = async (req: Request, res: Response) => {
  try {
    const payload: groupStatus = req.body;

    const classRepository = appSource.getRepository(GroupMaster);
    //  check whether exist code
    const existingClass = await classRepository.findOneBy({
      groupCode: payload.groupCode,
    });
    if (!existingClass) {
      return res.status(404).json({ ErrorMessage: "Group Not Found" });
    }
    await classRepository
      .createQueryBuilder()
      .update(GroupMaster)
      .set({ status: payload.status })
      .where({ groupCode: payload.groupCode })
      .execute();
    const logsPayload: logsDto = {
      UserId: payload.loginUserId,
      UserName: payload.loginUserName,
      statusCode: 200,
      Message: `Changed Status for  ${existingClass.groupName} Group to ${payload.status} By - `,
    };
    await InsertLog(logsPayload);
    return res
      .status(200)
      .json({ IsSuccess: "Group Status Updated Successfully" });
  } catch (error) {
    return res.status(500).json({
      message: "Internal server error",
      error: error instanceof Error ? error.message : error,
    });
  }
};
