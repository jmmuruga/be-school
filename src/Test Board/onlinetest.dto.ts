import * as Joi from "joi";

export const OnlineTestValidation = Joi.object({
  Subject: Joi.string().required(),
  TestType: Joi.string().required(),
  Numofquestion: Joi.number().required(),
  isActive: Joi.boolean().optional(),
  created_UserId: Joi.string().required(),
  updated_UserId: Joi.string().optional().allow(null , ""),
});
export interface onlinetestDto {
  Subject: string;
  TestType: string;
  Numofquestion: number;
  isActive: Boolean;
  created_UserId: string;
  updated_UserId: string;
}
