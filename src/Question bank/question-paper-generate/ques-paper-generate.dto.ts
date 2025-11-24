import * as Joi from "joi";
export const QuesgenerateValidation = Joi.object({
  type: Joi.string().required(),
  standard: Joi.string().required(),
  subject: Joi.string().required(),
  total: Joi.number().required(),
  onemark: Joi.number().optional().allow(null),
  twomark: Joi.number().optional().allow(null),
  threemark: Joi.number().optional().allow(null),
  fivemark: Joi.number().optional().allow(null),
  isActive: Joi.boolean().optional(),
  created_UserId: Joi.string().optional(),
  updated_UserId: Joi.string().optional(),
});
export interface QuesgenerateDto {
  type: string;
  standard: string;
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
