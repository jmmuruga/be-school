import * as Joi from "joi";
export const logsValidation = Joi.object({
  UserId: Joi.number().required(),
  UserName: Joi.string().optional().allow("", null),
  statusCode: Joi.number().required(),
  Message: Joi.string().required(),
});
export interface logsDto {
  UserId: number;
  UserName: string;
  statusCode: number;
  Message: string;
}
