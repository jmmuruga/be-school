import * as Joi from "joi";

export const SchoolValidation = Joi.object({
  school_Id: Joi.number().required(),
  school: Joi.string().required(),
  isActive: Joi.boolean().optional(),
  updateStatus: Joi.boolean().optional(),
  created_UserId: Joi.string().required(),
  updated_UserId: Joi.string().optional().allow(null, ""),
});
export interface SchoolDto {
  school_Id: number;
  school: string;
  isActive: boolean;
  updateStatus: boolean;
  created_UserId: string;
  updated_UserId: string;
}
export interface DeleteSchoolDto {
  school_Id: number;
  loginUserId: number;
  loginUserName: string;
}
export interface schoolStatus {
  school_Id: number;
  status: boolean;
  loginUserId: number;
  loginUserName: string;
}
