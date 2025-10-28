import { UserDto, UserStatus, UserValidation } from "./user.dto";
import { Request, Response } from "express";
import { User } from "./user.model";
import { appSource } from "../core/database/db";
import { Not } from "typeorm";

export const addUser = async (req: Request, res: Response) => {
  try {
    const payload: UserDto = req.body;
    const validation = UserValidation.validate(payload);
    if (validation.error) {
      return res.status(400).json({
        message: validation.error.details[0].message,
      });
    }
    const userRepoistry = appSource.getRepository(User);
    // check data whether existing
    const existingUser = await userRepoistry.findOneBy({
      userName: payload.userName,
    });
    if (existingUser) {
      return res.status(400).json({
        message: "user Name already exists ",
      });
    }
    await userRepoistry.save(payload);
    return res.status(200).json({ message: "User added successfully" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal server error" });
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
    console.log(error);
  }
};
export const getUserId = async (req: Request, res: Response) => {
  try {
    const userRepoistry = appSource.getRepository(User);
    let UserID = await userRepoistry.query(
      `SELECT UserID
        FROM [${process.env.DB_NAME}].[dbo].[user] 
        Group by UserID
        ORDER BY CAST(UserID AS INT) DESC;`
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
    console.log(error);
  }
};
export const updateUserLogin = async (req: Request, res: Response) => {
  try {
    // get the data
    const payload: UserDto = req.body;
    const validation = UserValidation.validate(payload);
    // validation
    if (validation.error) {
      console.log(validation.error, "Validation Error");
      return res.status(400).json({
        message: validation.error.details[0].message,
      });
    }
    // check whether user exist
    const userRepository = appSource.getRepository(User);
    const existingUser = await userRepository.findOneBy({
      UserID: payload.UserID,
    });
    if (!existingUser) {
      return res.status(400).json({
        message: "User Doesn't exist ",
      });
    }
    // check name already exist
    const nameExist = await userRepository.findBy({
      userName: payload.userName,
      UserID: Not(payload.UserID),
    });
    if (nameExist.length > 0) {
      return res.status(400).json({
        message: "User Name Already Exist",
      });
    }
    await userRepository.update({ UserID: payload.UserID }, payload);
    return res.status(200).json({ IsSuccess: "User Updated Successfully !!!" });
  } catch (error) {
    console.error("Update Error:", error);
    return res.status(500).json({
      message: "Internal server error",
      error: error instanceof Error ? error.message : error,
    });
  }
};
export const deleteUser = async (req: Request, res: Response) => {
  try {
    const UserID = Number(req.params.UserID);
    console.log(" deleting user:", UserID);

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

    return res.status(200).json({ IsSuccess: "User Deleted Successfully !!" });
  } catch (error) {
    console.error("delete error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
export const updateUserStatus = async (req: Request, res: Response) => {
  try {
    const payload: UserStatus = req.body;
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
    return res
      .status(200)
      .json({ IsSuccess: "User Status updated Successfully !" });
  } catch (error) {
    console.error("Update Error:", error);
    return res.status(500).json({
      message: "Internal server error",
    });
  }
};
