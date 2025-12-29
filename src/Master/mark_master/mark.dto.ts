import * as Joi from "joi";

export const MarkValidation = Joi.object({
  markCode: Joi.number().required(),
  mark: Joi.number().required(),
  isActive: Joi.boolean().optional(),
  updateStatus: Joi.boolean().optional(),
  created_UserId: Joi.string().required(),
  updated_UserId: Joi.string().optional().allow(null, ""),
});
export interface MarkDto {
  markCode: number;
  mark: number;
  isActive: boolean;
  updateStatus: boolean;
  created_UserId: string;
  updated_UserId: string;
}
export interface DeleteMarkDto {
  markCode: number;
  loginUserId: number;
  loginUserName: string;
}
export interface markStatus {
  markCode: number;
  status: boolean;
  loginUserId: number;
  loginUserName: string;
}
