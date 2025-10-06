import * as Joi from 'joi';

export const MediumValidation = Joi.object({
  mediumCode: Joi.number().required(),
  medium: Joi.string().required(),
  isActive: Joi.boolean().optional(),
  created_UserId: Joi.string().optional(),
  updated_UserId: Joi.string().optional(),
});
export interface MediumDto {
  mediumCode: number;
  medium: string;
  isActive: boolean;
  created_UserId: string;
  updated_UserId: string;
}