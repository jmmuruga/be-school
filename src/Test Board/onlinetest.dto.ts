import * as Joi from "joi";

export const OnlineTestValidation = Joi.object({
  subjectName_Id: Joi.string().required(),
  TestType: Joi.string().required(),
  Numofquestion: Joi.number().required(),
  studentName: Joi.string().optional().allow("", null),
  studentusername: Joi.string().optional().allow("", null),
  studentStandard: Joi.string().optional().allow("", null),
   Stream_Id: Joi.string().optional().allow("", null),
  isActive: Joi.boolean().optional(),
  StudentLoginId:Joi.string().required(),
  created_UserId: Joi.string().required(),
  updated_UserId: Joi.string().optional().allow(null, ""),
});
export interface onlinetestDto {
  subjectName_Id: string;
  TestType: string;
  Numofquestion: number;
  studentName?: string;
  studentusername?:string;
  studentStandard?: string;
  Stream_Id?:string;
  isActive: Boolean;
  StudentLoginId:string;
  created_UserId: string;
  updated_UserId: string;
}