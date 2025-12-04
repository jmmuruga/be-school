import { Request, Response } from "express";
import { appSource } from "../core/database/db";
import { UserRightDto } from "./user-rights.dto";
import { UserRightValidation } from "./user-rights.dto";
import { UserRight } from "./user-rights.model";
import { not } from "joi";
import { In, Not } from "typeorm";
export const addUserRight = async (req: Request, res: Response) => {
  try {
    const payload: UserRightDto = req.body;
    const validation = UserRightValidation.validate(payload);
    if (validation.error) {
      return res.status(400).json({
        message: validation.error.details[0].message,
      });
    }
    const userRightRepository = appSource.getRepository(UserRight);
    // check
  const allFormCodes = Object.values(payload.selectedForms)
  .flat()
  .map((f: any) => f.formCode);

// check duplicates for this user type
const userRepoistry = appSource.getRepository(UserRight);

const nameExist = await userRepoistry.find({
  where: {
    formCode: In(allFormCodes),
    UserRightTypeId: Not(payload.UserRightTypeId),
  },
});

if (nameExist.length > 0) {
  return res.status(400).json({
    ErrorMessage: "FormCode already exists for another user type!",
  });
}
    await userRightRepository.save(payload);
    return res.status(200).json({ IsSuccess: "Added Successfully" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Internal server error",
      error: error instanceof Error ? error.message : error,
    });
  }
};
export const getUserRightId = async (req: Request, res: Response) => {
  try {
    const userRightRepositary = appSource.getRepository(UserRight);
    let UserRightTypeId = await userRightRepositary.query(
      `SELECT UserRightTypeId
            FROM [${process.env.DB_NAME}].[dbo].[user_right] 
            Group by UserRightTypeId
            ORDER BY CAST(UserRightTypeId AS INT) DESC;`
    );
    let id = "0";
    if (UserRightTypeId?.length > 0) {
      id = UserRightTypeId[0].UserRightTypeId;
    }
    const finalRes = Number(id) + 1;
    res.status(200).send({
      Result: finalRes,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Internal server error",
      error: error instanceof Error ? error.message : error,
    });
  }
};
export const getUserRightDetails = async (req: Request, res: Response) => {
  try {
    const userRepoistry = appSource.getRepository(UserRight);
    // get the details
    const userM = await userRepoistry.find();

    res.status(200).send({
      Result: userM,
    });
  } catch (error) {
    console.log(error);
  }
};
export const updateUserRight = async (req: Request, res: Response) => {
  try {
    // get the data
    const payload: UserRightDto = req.body;
    const validation = UserRightValidation.validate(payload);
    // validation
    if (validation.error) {
      return res.status(400).json({
        message: validation.error.details[0].message,
      });
    }
    // check whether already exist
 const allFormCodes = Object.values(payload.selectedForms)
  .flat()
  .map((f: any) => f.formCode);

// check duplicates for this user type
const userRepoistry = appSource.getRepository(UserRight);

const nameExist = await userRepoistry.find({
  where: {
    formCode: In(allFormCodes),
    UserRightTypeId: Not(payload.UserRightTypeId),
  },
});

if (nameExist.length > 0) {
  return res.status(400).json({
    ErrorMessage: "FormCode already exists for another user type!",
  });
}
    await userRepoistry.update(
      { UserRightTypeId: payload.UserRightTypeId },
      payload
    );
    return res.status(200).json({ IsSuccess: "User Updated Successfully !!" });
  } catch (error) {
    console.error("Update Error:", error);
    return res.status(500).json({
      message: "Internal server error",
      error: error instanceof Error ? error.message : error,
    });
  }
};
