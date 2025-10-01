import * as Joi from "joi";

export const objectquesValidation = Joi.object({
  standard: Joi.string().required(),
  subject: Joi.string().required(),
  type: Joi.string().required(),
  question: Joi.string().required(),
  ImageaPath: Joi.string().required(),
  FilePath: Joi.string().required(),
  answerType: Joi.string().required(),
  option1: Joi.string().required(),
  option2: Joi.string().required(),
  option3: Joi.string().required(),
  option4: Joi.string().required(),
  correctanswer: Joi.string().required(),
  isActive: Joi.boolean().required(),
  created_UserId: Joi.string().required(),
  updated_UserId: Joi.string().required(),
});
export interface objectivequesDto {
  standard: string;
  subject: string;
  type: string;
  question: string;
  ImagePath: string;
  FilePath: string;
  answerType: string;
  option1: string;
  option2: string;
  option3: string;
  option4: string;
  correctanswer: string;
  isActive: Boolean;
  created_UserId: string;
  updated_UserId: string;
}
