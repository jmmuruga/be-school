import * as Joi from "joi";
export const QuesgenerateValidation = Joi.object({
  type: Joi.string().required(),
  ClassName_Id: Joi.string().required(),
  subjectName_Id: Joi.string().required(),
  total: Joi.number().required(),
  onemark: Joi.number().optional().allow(null),

  optionType: Joi.string().optional().allow(null),
  twomark: Joi.number().optional().allow(null),
  threemark: Joi.number().optional().allow(null),
  fivemark: Joi.number().optional().allow(null),
  isActive: Joi.boolean().optional(),
  created_UserId: Joi.string().required(),
  updated_UserId: Joi.string().optional().allow(null, ""),
});
export interface QuesgenerateDto {
  type: string;
  ClassName_Id: string;
  subjectName_Id: string;
  total: number;
  onemark: number;
  optionType: string;
  option1: string;
  option2: string;
  option3: string;
  option4: string;
  twomark: number;
  threemark: number;
  fivemark: number;
  isActive: Boolean;
  created_UserId: string;
  updated_UserId: string;
}
