import * as Joi from "joi";
export const UserRightValidation = Joi.object({
  UserRightTypeId: Joi.string().required(),
  selectedForms: Joi.object().pattern(
    Joi.string(),
    Joi.array().items(
      Joi.object({
        formCode: Joi.string().required(),
        formName: Joi.string().required(),
        parentId: Joi.string().required(),
      })
    )
  ),
  loginUserId: Joi.number().required(),
  loginUserName: Joi.string().required(),
  created_UserId: Joi.string().required(),
  updated_UserId: Joi.string().optional().allow(null, ""),
});
export interface UserRightDto {
  UserRightTypeId: string;
  selectedForms: {
    [key: string]: {
      formName: string;
      formCode: string;
      parentId: string;
    }[];
  };
  loginUserId?: number;
  loginUserName?: string;
  created_UserId: string;
  updated_UserId: string;
}
