import * as Joi from 'joi';

export const ClassValidation = Joi.object({
  classCode: Joi.number().required(),
  className: Joi.string().required(),
  isActive: Joi.boolean().optional(),
  updateStatus :Joi.boolean().optional(),
  created_UserId: Joi.string().optional(),
  updated_UserId: Joi.string().optional(),
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