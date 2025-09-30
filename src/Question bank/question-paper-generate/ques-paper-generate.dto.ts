import * as Joi from "joi";
export const QuesgenerateValidation = Joi.object({
  scheme: Joi.string().required(),
  class: Joi.string().required(),
  subject: Joi.string().required(),
  total: Joi.number().required(),
  isActive: Joi.boolean().required(),
  created_UserId: Joi.string().required(),
  updated_UserId: Joi.string().required(),
});
export interface QuesgenerateDto {
  scheme: string;
  class: string;
  subject: string;
  total: number;
  isActive:Boolean;
  created_UserId: string;
  updated_UserId: string;
}
