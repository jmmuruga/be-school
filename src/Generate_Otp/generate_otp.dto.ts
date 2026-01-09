import * as Joi from "joi";
export const logsValidation = Joi.object({
  studentId: Joi.number().required(),
  Generated_Otp: Joi.string().optional().allow("", null),
});
export interface logsDto {
  studentId: number; 
  Generated_Otp:number
}
