import * as Joi from "joi";

export const OnlineTestValidation = Joi.object({
  Subject: Joi.string().required(),
  TestType: Joi.string().required(),
  Numofquestion: Joi.number().required(),
  isActive: Joi.boolean().required(),
  created_UserId: Joi.string().required(),
  updated_UserId: Joi.string().required(),
});
export interface onlinetestDto {
  Subject: string;
  TestType: string;
  Numofquestion: string;
  isActive: Boolean;
  created_UserId: string;
  updated_UserId: string;
}
