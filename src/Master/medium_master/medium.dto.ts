import * as Joi from "joi";

export const StreamValidation = Joi.object({
  Stream_Id: Joi.number().required(),
  Stream: Joi.string().required(),
  isActive: Joi.boolean().optional(),
  updateStatus: Joi.boolean().optional(),
  created_UserId: Joi.string().required(),
  updated_UserId: Joi.string().optional().allow(null, ""),
    loginUserName: Joi.string().optional().allow(null, ""),
});
export interface StreamDto {
  Stream_Id: number;
  Stream: string;
  isActive: boolean;
  updateStatus: boolean;
  created_UserId: string;
  updated_UserId: string;
  loginUserName?: string;
}
export interface StreamStatus {
  Stream_Id: number;
  status: boolean;
  loginUserId: number;
  loginUserName: string;
}
export interface DeleteStreamDto {
  Stream_Id: number;
  loginUserId: number;
  loginUserName: string;
}
