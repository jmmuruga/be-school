import { UserDto, UserValidation } from "./user.dto";
import { json, Request, Response } from "express";
import { User } from "./user.model";
import { appSource } from "../core/database/db";
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
    let userID = await userRepoistry.query(
      `SELECT userID
        FROM [${process.env.DB_NAME}].[dbo].[User] 
        Group by userID
        ORDER BY CAST(userID AS INT) DESC;`
    );
    let id = "0";
    if (userID?.length > 0) {
      id = userID[0].userID;
    }
    const finalRes = Number(id) + 1;
    res.status(200).send({
      Result: finalRes,
    });
  } catch (error) {
    console.log(error);
  }
};
