import * as Joi from "joi";

export const QuestionValidation = Joi.object({
  ClassName_Id: Joi.string().required(),
  subjectName_Id: Joi.string().required(),
  type: Joi.string().required(),
  mark: Joi.number().required(),
  question: Joi.string().optional().allow(null, ""),
  Imagequestion: Joi.string().optional().allow(null, ""),
  isActive: Joi.boolean().optional(),
  created_UserId: Joi.string().required(),
  updated_UserId:Joi.string().optional().allow(null, ""),
});
export interface QuestionDto {
  ClassName_Id: string;
  subjectName_Id: string;
  type: string;
  mark: number;
  question: string;
  Imagequestion?: string;
  FilePath?: string;
  isActive: Boolean;
  created_UserId: string;
  updated_UserId: string;
}
