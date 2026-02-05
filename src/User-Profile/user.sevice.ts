import { UserDto, UserStatus, UserValidation } from "./user.dto";
import { Request, Response } from "express";
import { User } from "./user.model";
import { appSource } from "../core/database/db";
import { In, Not } from "typeorm";
import { logsDto } from "../logs/logs.dto";
import { InsertLog } from "../logs/logs.service";
// import { ValidationException } from "../exceptions/ValidationException";

export const addUser = async (req: Request, res: Response) => {
  const payload: UserDto = req.body;
  try {
    const validation = UserValidation.validate(payload);
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
    const userRepoistry = appSource.getRepository(User);
    // check data whether existing
    const existingName = await userRepoistry.findOneBy({
      userName: payload.userName,
      UserID: Not(payload.UserID),
    });
    const emailExisting = await userRepoistry.findBy({
      email: payload.email,
      UserID: Not(payload.UserID),
    });
    const phoneExisting = await userRepoistry.findBy({
      phone: payload.phone,
      UserID: Not(payload.UserID),
    });
    if (phoneExisting.length > 0 && emailExisting.length > 0) {
      return res.status(400).json({
        ErrorMessage: "Phone Number And Email Id Already Exist",
      });
    }
    if (existingName && emailExisting.length > 0) {
      return res.status(400).json({
        ErrorMessage: "User Name And Email Id Already Exist",
      });
    }
    if (existingName && phoneExisting.length > 0) {
      return res.status(400).json({
        ErrorMessage: "User Name And Phone Number is Already Exist",
      });
    }
    if (existingName) {
      return res.status(400).json({
        ErrorMessage: "User Already Exists ",
      });
    }
    if (emailExisting.length > 0) {
      return res.status(400).json({
        ErrorMessage: "Email  Id Already Exists ",
      });
    }
    if (phoneExisting.length > 0) {
      return res.status(400).json({
        ErrorMessage: "Phone Number Already Exists ",
      });
    }
    const { loginUserName, ...data } = payload;
    await userRepoistry.save(data);
    const logsPayload: logsDto = {
      UserId: Number(payload.created_UserId),
      UserName: loginUserName,
      statusCode: 200,
      Message: `User Added Successfully By - `,
    };
    await InsertLog(logsPayload);
    return res.status(200).json({ IsSuccess: "User Added Successfully !!" });
  } catch (error) {
    const logsPayload: logsDto = {
      UserId: Number(payload.created_UserId),
      UserName: payload.loginUserName,
      statusCode: 500,
      Message: `Error while adding User Details - ${error.message}`,
    };
    await InsertLog(logsPayload);
    return res.status(500).json({
      message: "Internal server error",
      error: error instanceof Error ? error.message : error,
    });
  }
};
export const getUserDetails = async (req: Request, res: Response) => {
  try {
    const userRepoistry = appSource.getRepository(User);
    // get the details
    const userM = await userRepoistry.find({ where: { isActive: true } });

    res.status(200).send({
      Result: userM,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Internal server error",
      error: error instanceof Error ? error.message : error,
    });
  }
};
export const getUserId = async (req: Request, res: Response) => {
  try {
    const userRepoistry = appSource.getRepository(User);
    let UserID = await userRepoistry.query(
      `SELECT UserID
        FROM [${process.env.DB_NAME}].[dbo].[user] 
        Group by UserID
        ORDER BY CAST(UserID AS INT) DESC;`,
    );
    let id = "0";
    if (UserID?.length > 0) {
      id = UserID[0].UserID;
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
  }
};
export const updateUserLogin = async (req: Request, res: Response) => {
  const payload: UserDto = req.body;
  try {
    // get the data
    const validation = UserValidation.validate(payload);
    // validation
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
    // check whether user exist
    const userRepository = appSource.getRepository(User);
    // check name already exist
    const nameExist = await userRepository.findBy({
      userName: payload.userName,
      UserID: Not(payload.UserID),
    });
    if (nameExist.length > 0) {
      return res.status(400).json({
        ErrorMessage: "User Name Already Exist",
      });
    }
    // check phone number  and email already exist
    const phoneExist = await userRepository.findBy({
      phone: payload.phone,
      UserID: Not(payload.UserID),
    });
    const emailExist = await userRepository.findBy({
      email: payload.email,
      UserID: Not(payload.UserID),
    });

    if (phoneExist.length > 0 && emailExist.length > 0) {
      return res.status(400).json({
        ErrorMessage: "Phone Number And Email Id Already Exist",
      });
    }
    if (nameExist.length > 0 && emailExist.length > 0) {
      return res.status(400).json({
        ErrorMessage: "User Name And Email Id Already Exist",
      });
    }
    if (nameExist.length > 0 && phoneExist.length > 0) {
      return res.status(400).json({
        ErrorMessage: "User Name And Phone Number is Already Exist",
      });
    }
    if (
      nameExist.length > 0 &&
      phoneExist.length > 0 &&
      emailExist.length > 0
    ) {
      return res.status(400).json({
        ErrorMessage: "User Name , Phone Number And Email Id is Already Exist",
      });
    }
    if (phoneExist.length > 0) {
      return res.status(400).json({
        ErrorMessage: "Phone Number  Already Exist",
      });
    }
    if (emailExist.length > 0) {
      return res.status(400).json({
        ErrorMessage: "Email Id Already Exist",
      });
    }
    const { loginUserName, ...data } = payload;
    await userRepository.update({ UserID: payload.UserID }, data);
    const logsPayload: logsDto = {
      UserId: Number(payload.updated_UserId),
      UserName: loginUserName,
      statusCode: 200,
      Message: `Updated  User - userId : ${payload.UserID} Successfully By - `,
    };
    await InsertLog(logsPayload);
    return res.status(200).json({ IsSuccess: "User Updated Successfully !!!" });
  } catch (error) {
    const logsPayload: logsDto = {
      UserId: Number(payload.updated_UserId),
      UserName: payload.loginUserName,
      statusCode: 500,
      Message: `Error while updating the User Details - ${error.message}`,
    };
    await InsertLog(logsPayload);
    return res.status(500).json({
      message: "Internal server error",
      error: error instanceof Error ? error.message : error,
    });
  }
};
export const deleteUser = async (req: Request, res: Response) => {
  const UserID = Number(req.params.UserID);
  const { loginUserId, loginUserName } = req.body;
  try {
    // console.log(" deleting user:", UserID);
    if (isNaN(UserID)) {
      return res.status(400).json({ ErrorMessage: "Invalid User Id " });
    }
    const userRepository = appSource.getRepository(User);

    //  check whether exist code
    const existingUser = await userRepository.findOneBy({
      UserID: UserID,
    });

    if (!existingUser) {
      return res.status(404).json({ ErrorMessage: "User not found" });
    }
    // delete and active
    await userRepository
      .createQueryBuilder()
      .update(User)
      .set({ isActive: false })
      .where({ UserID: UserID })
      .execute();
    const logsPayload: logsDto = {
      UserId: loginUserId,
      UserName: loginUserName,
      statusCode: 200,
      Message: ` Successfully  deleted  ${existingUser.userName} details By - `,
    };
    await InsertLog(logsPayload);
    return res.status(200).json({ IsSuccess: "User Deleted Successfully !!" });
  } catch (error) {
    const logsPayload: logsDto = {
      UserId: loginUserId,
      UserName: loginUserName,
      statusCode: 500,
      Message: `Error while deleting User Details - ${error.message}`,
    };
    await InsertLog(logsPayload);
    return res.status(500).json({
      message: "Internal server error",
      error: error instanceof Error ? error.message : error,
    });
  }
};
export const updateUserStatus = async (req: Request, res: Response) => {
  const payload: UserStatus = req.body;
  try {
    const userRepository = appSource.getRepository(User);
    const existingUser = await userRepository.findOneBy({
      UserID: payload.UserID,
    });

    if (!existingUser) {
      return res.status(400).json({
        ErrorMessage: "User not found",
      });
    }
    await userRepository
      .createQueryBuilder()
      .update(User)
      .set({ status: payload.status })
      .where({ UserID: payload.UserID })
      .execute();
    const logsPayload: logsDto = {
      UserId: payload.loginUserId,
      UserName: payload.loginUserName,
      statusCode: 200,
      Message: `Changed User Status for  ${existingUser.userName} to ${payload.status} By - `,
    };
    await InsertLog(logsPayload);

    return res.status(200).json({
      IsSuccess: "User Status updated Successfully !",
    });
  } catch (error) {
    const logsPayload: logsDto = {
      UserId: payload.loginUserId,
      UserName: payload.loginUserName,
      statusCode: 500,
      Message: `Error while updating User status - ${error.message}`,
    };
    await InsertLog(logsPayload);
    return res.status(500).json({
      message: "Internal server error",
      error: error instanceof Error ? error.message : error,
    });
  }
};
