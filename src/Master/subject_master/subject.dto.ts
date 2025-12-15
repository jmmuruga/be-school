import e from "express";
import * as Joi from "joi";

export const Subjectvalidation = Joi.object({
  subjectCode: Joi.number().required(),
  subjectName: Joi.string().required(),
  subjectType: Joi.string().required(),
  selectedClasses: Joi.string().required(),
  isActive: Joi.boolean().optional(),
  updateStatus: Joi.boolean().optional(),
  created_UserId: Joi.string().required(),
  updated_UserId: Joi.string().optional().allow(null, ""),
});
export interface SubjectDto {
  subjectCode: number;
  subjectName: string;
  subjectType: string;
  selectedClasses: string;
  isActive: boolean;
  updateStatus: boolean;
  created_UserId: string;
  updated_UserId: string;
}

export interface subjectStatus {
  subjectCode: number;
  status: boolean;
  loginUserId: number;  
  loginUserName:string;
}
