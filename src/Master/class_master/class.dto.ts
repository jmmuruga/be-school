import * as Joi from 'joi';

export const ClassValidation = Joi.object({
  classCode: Joi.number().required(),
  className: Joi.string().required(),
  isActive: Joi.boolean().optional(),
  created_UserId: Joi.string().optional(),
  updated_UserId: Joi.string().optional(),
});

export interface ClassDto {
  classCode: number;
  className: string;
  isActive: boolean;
  created_UserId: string;
  updated_UserId: string;
        
}

