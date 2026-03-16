import * as Joi from "joi";
export const logsValidation = Joi.object({
  userId: Joi.number().required(),
  Generated_Otp: Joi.string().optional().allow("", null),
});
export interface logsDto {
  userId: number; 
  Generated_Otp:number
}
