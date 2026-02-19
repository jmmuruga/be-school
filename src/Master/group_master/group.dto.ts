import * as Joi from "joi";

export const GroupValidation = Joi.object({
  Group_Id: Joi.number().required(),
  className_Id: Joi.string().required(),
  groupName: Joi.string().required(),
  groupDescription: Joi.string().required(),
  isActive: Joi.boolean().optional(),
  updateStatus: Joi.boolean().optional(),
  created_UserId: Joi.string().required(),
  updated_UserId: Joi.string().optional().allow(null, ""),
  loginUserName: Joi.string().optional().allow(null, ""),

});

export interface GroupDto {
  Group_Id: number;
  className_Id: string;
  groupName: string;
  groupDescription: string;
  isActive: boolean;
  updateStatus: boolean;
  created_UserId: string;
  updated_UserId: string;
  loginUserName?:string;
}

export interface groupStatus {
  Group_Id: number;
  status: boolean;
  loginUserId: number;
  loginUserName: string;
}
export interface DeleteGroupDto {
  Group_Id: number;
  loginUserId: number;
  loginUserName: string;
}
