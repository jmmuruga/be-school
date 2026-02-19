import * as Joi from "joi";

export const ClassValidation = Joi.object({
  Class_Id: Joi.number().required(),
  className: Joi.string().required(),
  isActive: Joi.boolean().optional(),
  updateStatus: Joi.boolean().optional(),
  created_UserId: Joi.string().required(),
  updated_UserId: Joi.string().optional().allow(null, ""),
  loginUserName: Joi.string().optional().allow(null, ''),

});

export interface ClassDto {
  Class_Id: number;
  className: string;
  loginUserName?:string
  isActive: boolean;
  updateStatus: boolean;
  created_UserId: string;
  updated_UserId: string;
}

export interface classStatus {
  Class_Id: number;
  status: boolean;
  loginUserId: number;
  loginUserName: string;
}

export interface DeleteClassDto {
  Class_Id: number;
  loginUserId: number;
  loginUserName: string;
}
