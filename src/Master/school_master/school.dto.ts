import * as Joi from 'joi';

export const SchoolValidation = Joi.object({
  schoolCode: Joi.number().required(),
  school: Joi.string().required(),
  isActive: Joi.boolean().optional(),
  updateStatus:Joi.boolean().optional(),
  created_UserId: Joi.string().required(),
  updated_UserId: Joi.string().optional().allow(null , ""),
});
export interface SchoolDto {
  schoolCode: number;
  school: string;
  isActive: boolean;
  updateStatus:boolean;
  created_UserId: string;
  updated_UserId: string;
}

export interface schoolStatus{
  schoolCode : number;
  status : boolean;
    loginUserId: number;  
  loginUserName:string;
}