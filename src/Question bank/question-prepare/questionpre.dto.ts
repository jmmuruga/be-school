import * as Joi from "joi";

export const QuestionValidation = Joi.object({
  standard: Joi.string().required(),
  subject: Joi.string().required(),
  type: Joi.string().required(),
  mark: Joi.number().required(),
  question: Joi.string().required(),
  isActive: Joi.boolean().required(),
  created_UserId: Joi.string().required(),
  updated_UserId: Joi.string().required(),
});
export interface QuestionDto {
  standard: string;
  subject: string;
  type: string;
  mark: number;
  question: string;
  isActive: Boolean;
  created_UserId: string;
  updated_UserId: string;
}
