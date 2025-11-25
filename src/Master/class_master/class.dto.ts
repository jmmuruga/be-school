import * as Joi from 'joi';

export const ClassValidation = Joi.object({
  classCode: Joi.number().required(),
  className: Joi.string().required(),
  isActive: Joi.boolean().optional(),
  updateStatus :Joi.boolean().optional(),
  created_UserId: Joi.string().required(),
  updated_UserId: Joi.string().optional().allow(null , ""),
});

export interface ClassDto {
  classCode: number;
  className: string;
  isActive: boolean;
  updateStatus:boolean;
  created_UserId: string;
  updated_UserId: string;
        
}

export interface classStatus{
  classCode : number;
  status : boolean;
}