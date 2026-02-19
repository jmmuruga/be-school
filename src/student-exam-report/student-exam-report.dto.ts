import * as Joi from "joi";
export const studentexamreportValidation = Joi.object({
    Question_Id: Joi.string().required(),
  StudentId: Joi.string().required(),
  subjectName_Id: Joi.string().required(),
  TestType: Joi.string().required(),
  NumOfQuestion: Joi.string().required(),
  Answered: Joi.boolean().optional(),
  ClassName_Id: Joi.string().optional().allow("", null),
});
export interface studentexamReportDto {
  Question_Id: string;
  StudentId: string;
  subjectName_Id: string;
  TestType?: string;
  Test_No: string;
  NumOfQuestion: string;
  Answered: boolean;
  ClassName_Id: string;
}
