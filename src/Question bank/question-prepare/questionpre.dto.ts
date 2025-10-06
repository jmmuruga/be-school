import * as Joi from "joi";

export const QuestionValidation = Joi.object({
  standard: Joi.string().required(),
  subject: Joi.string().required(),
  type: Joi.string().required(),
  mark: Joi.number().required(),
  question: Joi.string().required(),
  ImageaPath: Joi.string().required(),
  FilePath: Joi.string().required(),
  isActive: Joi.boolean().optional(),
  created_UserId: Joi.string().optional(),
  updated_UserId: Joi.string().optional(),
});
export interface QuestionDto {
  standard: string;
  subject: string;
  type: string;
  mark: number;
  question: string;
  ImagePath:string;
  FilePath:string;
  isActive: Boolean;
  created_UserId: string;
  updated_UserId: string;
}
