import * as Joi from "joi";

export const QuestionValidation = Joi.object({
  standard: Joi.string().required(),
  subject: Joi.string().required(),
  type: Joi.string().required(),
  mark: Joi.number().required(),
  question: Joi.string().optional().allow(null, ""),
  studentImage: Joi.string().optional().allow(null, ""),
  isActive: Joi.boolean().optional(),
  created_UserId: Joi.string().required(),
  updated_UserId:Joi.string().optional().allow(null, ""),
});
export interface QuestionDto {
  standard: string;
  subject: string;
  type: string;
  mark: number;
  question: string;
  studentImage?: string;
  FilePath?: string;
  isActive: Boolean;
  created_UserId: string;
  updated_UserId: string;
}
