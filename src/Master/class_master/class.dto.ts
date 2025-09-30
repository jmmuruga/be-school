import * as Joi from 'joi';

export const ClassValidation = Joi.object({
  classCode: Joi.number().required(),
  className: Joi.string().required(),
  isActive: Joi.boolean().required(),
  created_UserId: Joi.string().required(),
  updated_UserId: Joi.string().required(),
});

export interface ClassDto {
  classCode: number;
  className: string;
  isActive: boolean;
  created_UserId: string;
  updated_UserId: string;
        
}

