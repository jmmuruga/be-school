import * as Joi from 'joi';

export const MarkValidation = Joi.object({
  markcode: Joi.number().required(),
  mark: Joi.string().required(),
  isActive: Joi.boolean().required(),
  created_UserId: Joi.string().required(),
  updated_UserId: Joi.string().required(),

});
export interface MarkDto {
  markcode: number;
  mark: string;
  isActive: boolean;
  created_UserId: string;
  updated_UserId: string;
}