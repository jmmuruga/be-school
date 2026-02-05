import { appSource } from "../../core/database/db";
import { GroupDto, groupStatus, GroupValidation } from "./group.dto";
import { Request, Response } from "express";
import { GroupMaster } from "./group.model";
import { Not, PrimaryColumn } from "typeorm";
import { logsDto, logsValidation } from "../../logs/logs.dto";
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
  const payload: GroupDto = req.body;
  try {
    const validation = GroupValidation.validate(payload);
    if (validation.error) {
      const logsPayload: logsDto = {
        UserId: Number(payload.created_UserId),
        UserName: payload.loginUserName,
        statusCode: 500,
        Message: `Validation error: ${validation.error.details[0].message}`,
      };
      await InsertLog(logsPayload);
      return res.status(400).json({
        message: validation.error.details[0].message,
      });
    }

    // check data whether existing
    const groupRepoistry = appSource.getRepository(GroupMaster);
    const existingClass = await groupRepoistry.findOneBy({
      groupName: payload.groupName,
      className_Id: payload.className_Id,
    });

    if (existingClass) {
      const logsPayload: logsDto = {
        UserId: Number(payload.created_UserId),
        UserName: payload.loginUserName,
        statusCode: 500,
        Message: `Error while saving Group - ${payload.groupName} (Group Name already exists) -`,
      };
      await InsertLog(logsPayload);
      return res.status(400).json({
        ErrorMessage: "This Group Name is  already Existing !!",
      });
    }
    const {loginUserName,...data} = payload;
    await groupRepoistry.save(data);
    const logsPayload: logsDto = {
      UserId: Number(payload.created_UserId),
      UserName: loginUserName,
      statusCode: 200,
      Message: `Added Groupmaster - groupname (${payload.groupName})  Successfully By - `,
    };
    await InsertLog(logsPayload);
    return res.status(200).json({ IsSuccess: "Group Added Successfully !!" });
  } catch (error) {
    const logsPayload: logsDto = {
      UserId: Number(payload.created_UserId),
      UserName: payload.loginUserName,
      statusCode: 500,
      Message: `Error while adding group - ${
        error instanceof Error ? error.message : error
      }`,
    };
    await InsertLog(logsPayload);
    return res.status(500).json({
      message: "Internal server error",
      error: error instanceof Error ? error.message : error,
    });
  }
};
export const getGroupId = async (req: Request, res: Response) => {
  try {
    const groupRepositry = appSource.getRepository(GroupMaster);
    let Group_Id = await groupRepositry.query(
      `SELECT Group_Id
            FROM [${process.env.DB_NAME}].[dbo].[group_master] 
            Group by Group_Id
            ORDER BY CAST(Group_Id AS INT) DESC;`
    );
    let id = "0";
    if (Group_Id?.length > 0) {
      id = Group_Id[0].Group_Id;
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
    const payload: GroupDto = req.body;
 
  try {
    const validation = GroupValidation.validate(payload);
    if (validation.error) {
      const logsPayload: logsDto = {
        UserId: Number(payload.created_UserId),
        UserName: payload.loginUserName,
        statusCode: 500,
        Message: `Validation error: ${validation.error.details[0].message}`,
      };
      await InsertLog(logsPayload);
      return res.status(400).json({
        message: validation.error.details[0].message,
      });
    }
    // check whether class exist
    const groupRepository = appSource.getRepository(GroupMaster);
    const existingGroup = await groupRepository.findBy({
      Group_Id: payload.Group_Id,
    });
    if (!existingGroup) {
      const logsPayload: logsDto = {
        UserId: Number(payload.created_UserId),
        UserName: payload.loginUserName,
        statusCode: 500,
        Message: `Error while update group - ${payload.groupName} ( groupName already exists) -`,
      };
      await InsertLog(logsPayload);
      return res.status(400).json({
        ErrorMessage: "This Group Name is Already Existing",
      });
    }
    // check name  already exist
    const nameExist = await groupRepository.findBy({
      groupName: payload.groupName,
      className_Id: payload.className_Id,
      groupDescription: payload.groupDescription,
      Group_Id: Not(payload.Group_Id),
    });
    if (nameExist.length > 0) {
      return res.status(400).json({
        ErrorMessage: "This Group Name is Already Existing !!",
      });
    }
    const {loginUserName,...data} = payload;
    await groupRepository.update({ Group_Id: payload.Group_Id }, data);

    const logsPayload: logsDto = {
      UserId: Number(payload.created_UserId),
      UserName: loginUserName,
      statusCode: 200,
      Message: `Updated Group Master - Group_Id : ${existingGroup[0].Group_Id} ,old GroupName :${existingGroup[0].groupName} to new GroupName :${payload.groupName} Successfully By - `,
    };
    await InsertLog(logsPayload);
    return res.status(200).json({ IsSuccess: "Group Updated successfully !!" });
  } catch (error) {
    const logsPayload: logsDto = {
      UserId: Number(req.body.created_UserId),
      UserName:payload.loginUserName,
      statusCode: 500,
      Message: `Error while updating group - ${
        error instanceof Error ? error.message : error
      }`,
    };
    await InsertLog(logsPayload);
    return res.status(500).json({
      message: "Internal server error",
      error: error instanceof Error ? error.message : error,
    });
  }
};
export const deleteGroup = async (req: Request, res: Response) => {
  const Group_Id = Number(req.params.Group_Id);
  const { loginUserId, loginUserName } = req.body;
  try {
    if (isNaN(Group_Id)) {
      const logsPayload: logsDto = {
        UserId: loginUserId,
        UserName: loginUserName,
        statusCode: 500,
        Message: `Validation Failed - Invalid Group Id (${req.params.Group_Id})  by -`,
      };
      await InsertLog(logsPayload);
      return res.status(400).json({
        message: "Group_Id not found",
      });
    }
    const groupRepository = appSource.getRepository(GroupMaster);
    // Check whether groupId exists
    const existingGroup = await groupRepository.findOneBy({
      Group_Id: Group_Id,
    });
    if (!existingGroup) {
      const logsPayload: logsDto = {
        UserId: loginUserId,
        UserName: loginUserName,
        statusCode: 500,
        Message: `GroupMaster - Group_Id: ${existingGroup.Group_Id}, GroupName: ${existingGroup.groupName} not found by - `,
      };
      await InsertLog(logsPayload);
      return res.status(404).json({
        ErrorMessage: "Group_Id  not found",
      });
    }
    await groupRepository
      .createQueryBuilder()
      .delete()
      .update(GroupMaster)
      .set({ isActive: false })
      .where({ Group_Id: Group_Id })
      .execute();

    const logsPayload: logsDto = {
      UserId: loginUserId,
      UserName: loginUserName,
      statusCode: 200,
      Message: `Deleted GroupMaster Group_Id:${Group_Id} groupname: ${existingGroup.groupName} successfully By - `,
    };
    await InsertLog(logsPayload);

    // await groupRepository.delete(groupid);
    return res.status(200).json({
      IsSuccess: "Group Deleted Successfully !!",
    });
  } catch (error) {
    const logsPayload: logsDto = {
      UserId: loginUserId,
      UserName: loginUserName,
      statusCode: 500,
      Message: `Error while deleting group - ${error.message}`,
    };
    await InsertLog(logsPayload);
    return res.status(500).json({
      message: "Internal server error",
      error: error instanceof Error ? error.message : error,
    });
  }
};
export const updateGroupStatus = async (req: Request, res: Response) => {
  const payload: groupStatus = req.body;
  try {
    const classRepository = appSource.getRepository(GroupMaster);
    //  check whether exist code
    const existingClass = await classRepository.findOneBy({
      Group_Id: payload.Group_Id,
    });
    if (!existingClass) {
      const logsPayload: logsDto = {
        UserId: payload.loginUserId,
        UserName: payload.loginUserName,
        statusCode: 500,
        Message: `Group not found for Group_Id ${payload.Group_Id} by - `,
      };
      await InsertLog(logsPayload);
      return res.status(404).json({ ErrorMessage: "Group Not Found" });
    }
    await classRepository
      .createQueryBuilder()
      .update(GroupMaster)
      .set({ status: payload.status })
      .where({ Group_Id: payload.Group_Id })
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
    const logsPayload: logsDto = {
      UserId: payload.loginUserId,
      UserName: payload.loginUserName,
      statusCode: 500,
      Message: `Error while updating group status - ${error.message}`,
    };
    await InsertLog(logsPayload);
    return res.status(500).json({
      message: "Internal server error",
      error: error instanceof Error ? error.message : error,
    });
  }
};
