import * as Joi from "joi";

export const SignInvalidation = Joi.object({
  role: Joi.string().required(),
  email: Joi.string().email().required(),
  password: Joi.string().required(),
  AdmissionNo: Joi.string().required(),
  dateOfBirth: Joi.date().required(),
  isActive: Joi.boolean().required(),
  created_UserId: Joi.string().required(),
  updated_UserId: Joi.string().required(),
});
export interface SignInDto {
  role: string;
  email: string;
  password: string;
  AdmissionNo: string;
  dateOfBirth: Date;
  isActive: boolean;
  created_UserId: string;
  updated_UserId: string;
}
