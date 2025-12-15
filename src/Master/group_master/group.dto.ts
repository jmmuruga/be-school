import * as Joi from 'joi';

export const GroupValidation = Joi.object({
  groupCode: Joi.number().required(),
  groupoption: Joi.string().required(),
  groupName: Joi.string().required(),
  groupDescription: Joi.string().required(),
  isActive: Joi.boolean().optional(),
  updateStatus:Joi.boolean().optional(),
  created_UserId: Joi.string().required(),
  updated_UserId: Joi.string().optional().allow(null , ""),

});

export interface GroupDto {
  groupCode: number;
  groupoption: string;
  groupName: string;
  groupDescription: string;
  isActive: boolean;
  updateStatus:boolean;
  created_UserId: string;
  updated_UserId: string;
}

export interface groupStatus{
  groupCode : number;
  status : boolean;
    loginUserId: number;  
  loginUserName:string;
}