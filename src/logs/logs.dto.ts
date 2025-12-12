import * as Joi from "joi";
export const logsValidation = Joi.object({
  logId: Joi.number().required(),
  UserId: Joi.number().required(),
  UserName: Joi.string().required(),
  statusCode: Joi.number().required(),
  Message: Joi.string().required(),
});
export interface logsDto {
  logId: number;
  UserId: number;
  UserName: string;
  statusCode: number;
  Message: string;
}
