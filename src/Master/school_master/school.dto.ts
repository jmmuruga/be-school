import * as Joi from 'joi';

export const SchoolValidation = Joi.object({
  siNo: Joi.number().required(),
  school: Joi.string().required(),
  isActive: Joi.boolean().optional(),
  created_UserId: Joi.string().optional(),
  updated_UserId: Joi.string().optional(),
});
export interface SchoolDto {
  siNo: number;
  school: string;
  isActive: boolean;
  created_UserId: string;
  updated_UserId: string;
}