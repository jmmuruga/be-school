import * as Joi from "joi";
export const studentScoreResultValidation = Joi.object({
  StudentId: Joi.string().required(),
  subjectName_Id: Joi.string().required(),
  TestType: Joi.string().required(),
  NumOfQuestion: Joi.string().required(),
  NoOfAnswered: Joi.string().required(),
  NoOfCorrectAnswered: Joi.string().required(),
  studentName: Joi.string().optional().allow("", null),
  ClassName_Id: Joi.string().optional().allow("", null),
  NoOfWrongAnswered: Joi.string().required(),
  Time: Joi.string().required(),
  Time_Take: Joi.string().required(),
});

export interface studentScoreResultDto {
  StudentId: string;
  subjectName_Id: string;
  TestType: string;
  studentusername?:string;
  NumOfQuestion: string;
  NoOfAnswered: string;
  NoOfCorrectAnswered: string;
  NoOfWrongAnswered: string;
  Time: string;
  Time_Take: string;
  studentName?: string;
  ClassName_Id?: string;
}
