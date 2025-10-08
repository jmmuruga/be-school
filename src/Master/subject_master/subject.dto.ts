import * as Joi from 'joi';

export const Subjectvalidation = Joi.object({
  subjectCode: Joi.number().required(),
  subjectName: Joi.string().required(),
  subjectType: Joi.string().required(),
selectedClasses: Joi.string().required(),

  isActive: Joi.boolean().optional(),
  created_UserId: Joi.string().optional(),
  updated_UserId: Joi.string().optional(),
});
export interface SubjectDto {
  subjectCode: number;
  subjectName: string;
  subjectType: string;
  selectedClasses: string;
  isActive: boolean;
  created_UserId: string;
  updated_UserId: string;
}
