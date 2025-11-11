import * as Joi from "joi";

export const objectquesValidation = Joi.object({
  standard: Joi.string().required(),
  subject: Joi.string().required(),
  type: Joi.string().required(),
  question: Joi.string().required(),
  studentImage: Joi.string().optional(),
  FilePath: Joi.string().optional(),
  option1:Joi.string().optional(),
  option2: Joi.string().optional(),
  option3: Joi.string().optional(),
  option4: Joi.string().optional(),
  correctanswer: Joi.string().required(),
  isActive: Joi.boolean().optional(),
  created_UserId: Joi.string().optional(),
  updated_UserId: Joi.string().optional(),
});
export interface objectivequesDto {
  standard: string;
  subject: string;
  type: string;
  question: string;
  studentImage:string;
  FilePath: string;
  option1: string;
  option2: string;
  option3: string;
  option4: string;
  correctanswer: string;
  isActive: Boolean;
  created_UserId: string;
  updated_UserId: string;
}
