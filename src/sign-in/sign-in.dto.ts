import * as Joi from "joi";

export const SignInvalidation = Joi.object({
  role: Joi.string().optional(),
  email: Joi.string().email().optional(),
  password: Joi.string().optional(),
  usernameOrAdmission: Joi.string().optional(),
  Password: Joi.date().optional(),
  isActive: Joi.boolean().optional(),
  created_UserId: Joi.string().required(),
  updated_UserId: Joi.string().optional().allow(null),
});
export interface SignInDto {
  role: string;
  emailOrPhone: string;
  password: string;
  usernameOrAdmission: string;
  Password: string;
  isActive: boolean;
  created_UserId: string;
  updated_UserId: string;
}

