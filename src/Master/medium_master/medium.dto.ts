import * as Joi from "joi";

export const MediumValidation = Joi.object({
  medium_Id: Joi.number().required(),
  medium: Joi.string().required(),
  isActive: Joi.boolean().optional(),
  updateStatus: Joi.boolean().optional(),
  created_UserId: Joi.string().required(),
  updated_UserId: Joi.string().optional().allow(null, ""),
});
export interface MediumDto {
  medium_Id: number;
  medium: string;
  isActive: boolean;
  updateStatus: boolean;
  created_UserId: string;
  updated_UserId: string;
}
export interface mediumStatus {
  medium_Id: number;
  status: boolean;
  loginUserId: number;
  loginUserName: string;
}
export interface DeleteSchoolDto {
  medium_Id: number;
  loginUserId: number;
  loginUserName: string;
}
