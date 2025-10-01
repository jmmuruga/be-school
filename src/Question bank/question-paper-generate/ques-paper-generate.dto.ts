import * as Joi from "joi";
export const QuesgenerateValidation = Joi.object({
  scheme: Joi.string().required(),
  class: Joi.string().required(),
  subject: Joi.string().required(),
  total: Joi.number().required(),
  onemark: Joi.number().required(),
  twomark: Joi.number().required(),
  threemark: Joi.number().required(),
  fivemark: Joi.number().required(),
  isActive: Joi.boolean().required(),
  created_UserId: Joi.string().required(),
  updated_UserId: Joi.string().required(),
});
export interface QuesgenerateDto {
  scheme: string;
  class: string;
  subject: string;
  total: number;
  onemark:number;
  twomark:number;
  threemark:number;
  fivemark:number;
  isActive:Boolean;
  created_UserId: string;
  updated_UserId: string;
}
