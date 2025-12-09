import { Request, Response } from "express";
import { appSource } from "../core/database/db";
import { UserRightDto } from "./user-rights.dto";
import { UserRightValidation } from "./user-rights.dto";
import { UserRight } from "./user-rights.model";
import { not } from "joi";
import { In, Not, Repository } from "typeorm";
export const addOrUpdateUserRight = async (req: Request, res: Response) => {
  try {
    const payload: UserRightDto = req.body;

    // Validate payload
    const validation = UserRightValidation.validate(payload);
    if (validation.error) {
      return res.status(400).json({
        message: validation.error.details[0].message,
      });
    }
    const repo = appSource.getRepository(UserRight);
    // Ensure selectedForms is an array and has entries
    if (
      !payload.selectedForms ||
      (Array.isArray(payload.selectedForms)
        ? payload.selectedForms.length === 0
        : Object.keys(payload.selectedForms).length === 0)
    ) {
      return res.status(400).json({
        message: "Please select at least one form",
      });
    }
const existing = await repo.find({
  where: { UserRightTypeId: payload.UserRightTypeId },
});
    // Delete old records for this userType (and company if relevant)
   if (existing.length > 0) {
  // Existing = Update mode (delete and reinsert)
  await repo.delete({ UserRightTypeId: payload.UserRightTypeId });
} else {
 return;
}
 
    let insertData: any[] = [];

    if (Array.isArray(payload.selectedForms)) {
      // If selectedForms is a flat array
      insertData = payload.selectedForms.map((form) => ({
        UserRightTypeId: payload.UserRightTypeId,
        formCode: form.formCode,
        parentId: form.parentId,
        formName: form.formName,
        created_UserId: payload.created_UserId,
        updated_UserId: payload.updated_UserId,
      }));
    } else {
      // If selectedForms is an object with module names as keys (like in your example)
      for (const moduleName in payload.selectedForms) {
        const forms = payload.selectedForms[moduleName];
        if (Array.isArray(forms)) {
          forms.forEach((form) => {
            insertData.push({
              UserRightTypeId: payload.UserRightTypeId,
              formCode: form.formCode,
              parentId: form.parentId,
              formName: form.formName,
              created_UserId: payload.created_UserId,
              updated_UserId: payload.updated_UserId,
            });
          });
        }
      }
    }
    if (insertData.length === 0) {
      return res.status(400).json({
        message: "No forms to insert",
      });
    }

    // Insert new records
    await repo.save(insertData);

    return res.status(200).json({
      IsSuccess: "User rights saved successfully",
    });
  } catch (error) {
    console.error(error);
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
    // console.log(error);
    return res.status(500).json({
      message: "Internal server error",
      error: error instanceof Error ? error.message : error,
    });
  }
};
export const getUserRightDetails = async (req: Request, res: Response) => {
  try {
    const {userRightTypeId} = req.params;
    const userRepoistry = appSource.getRepository(UserRight);
    // get the details
    const userM = await userRepoistry.findBy({
      UserRightTypeId : userRightTypeId
    });

    res.status(200).send({
      Result: userM,
    });
  } catch (error) {
    // console.log(error);
      return res.status(500).json({
      message: "Internal server error",
      error: error instanceof Error ? error.message : error,
    });
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
