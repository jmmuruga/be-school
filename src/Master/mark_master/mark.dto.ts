import * as Joi from 'joi';

export const MarkValidation = Joi.object({
  markcode: Joi.number().required(),
  mark: Joi.number().required(),
  isActive: Joi.boolean().optional(),
  created_UserId: Joi.string().optional(),
  updated_UserId: Joi.string().optional(),

});
export interface MarkDto {
  markcode: number;
  mark: number;
  isActive: boolean;
  created_UserId: string;
  updated_UserId: string;
}