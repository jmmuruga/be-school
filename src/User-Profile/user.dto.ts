import * as Joi from "joi";
export const UserValidation = Joi.object({
  UserID: Joi.number().required(),
  userName: Joi.string().required(),
  email: Joi.string().required(),
  password: Joi.string().required(),
  confirmPassword: Joi.string().required(),
  roleType: Joi.string().required(),
  staffNo: Joi.string().required(),
  phone: Joi.string().required(),
  isActive: Joi.boolean().optional(),
  updateStatus: Joi.boolean().optional(),
  created_UserId: Joi.string().required(),
  updated_UserId: Joi.string().optional().allow(null, ""),
  loginUserName: Joi.string().optional().allow(null, ""),

});
export interface UserDto {
  UserID: number;
  userName: string;
  email: string;
  password: string;
  confirmPassword: string;
  roleType: string;
  staffNo: string;
  phone: string;
  isActive: boolean;
  updateStatus: boolean;
  created_UserId: string;
  updated_UserId: string;
  loginUserName?:string;
}
export interface UserStatus {
  UserID: number;
  status: boolean;
  loginUserId: number;
  loginUserName: string;
}
