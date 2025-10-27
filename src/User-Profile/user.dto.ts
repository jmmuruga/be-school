import * as Joi from "joi";
export const UserValidation = Joi.object({
  UserId: Joi.number().required(),
  userName: Joi.string().required(),
  email: Joi.string().required(),
  password: Joi.string().required(),
  confirmPassword: Joi.string().required(),
  roleType: Joi.string().required(),
  staffNo: Joi.string().required(),
  phone: Joi.number().required(),
  userAccess: Joi.string().optional(),
  dashboardAccess: Joi.string().optional(),
  masterParent: Joi.string().optional(),
  questionsParent: Joi.string().optional(),
  profileParent: Joi.string().optional(),
  isActive: Joi.boolean().optional(),
  created_UserId: Joi.string().optional(),
  updated_UserId: Joi.string().optional(),
});
export interface UserDto {
  userID: number;
  userName: string;
  email: string;
  password: string;
  confirmPassword: string;
  roleType: string;
  staffNo: string;
  userAccess: string;
  dashboardAccess: string;
  masterParent: string;
  questionsParent: string;
  profileParent: string;
  phone: number;
  isActive: boolean;
  created_UserId: string;
  updated_UserId: string;
}
