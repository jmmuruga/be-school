import * as Joi from 'joi';

export const SchoolValidation = Joi.object({
  schoolCode: Joi.number().required(),
  school: Joi.string().required(),
  isActive: Joi.boolean().optional(),
  updateStatus:Joi.boolean().optional(),
  created_UserId: Joi.string().optional(),
  updated_UserId: Joi.string().optional(),
});
export interface SchoolDto {
  schoolCode: number;
  school: string;
  isActive: boolean;
  updateStatus:boolean;
  created_UserId: string;
  updated_UserId: string;
}