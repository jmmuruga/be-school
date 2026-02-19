import * as Joi from "joi";

export const MarkValidation = Joi.object({
  mark_Id: Joi.number().required(),
  mark: Joi.number().required(),
  isActive: Joi.boolean().optional(),
  updateStatus: Joi.boolean().optional(),
  created_UserId: Joi.string().required(),
  updated_UserId: Joi.string().optional().allow(null, ""),
  loginUserName: Joi.string().optional().allow(null, ""),
  
});
export interface MarkDto {
  mark_Id: number;
  mark: number;
  isActive: boolean;
  updateStatus: boolean;
  created_UserId: string;
  updated_UserId: string;
  loginUserName?:string;
}
export interface DeleteMarkDto {
  mark_Id: number;
  loginUserId: number;
  loginUserName: string;
}
export interface markStatus {
  mark_Id: number;
  status: boolean;
  loginUserId: number;
  loginUserName: string;
}
