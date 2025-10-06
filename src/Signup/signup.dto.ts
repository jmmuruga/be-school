import * as Joi from "joi";

export const SignupValidation = Joi.object({
  name: Joi.string().required(),
  fatherName: Joi.string().required(),
  UserName: Joi.string().required(),
  password: Joi.string().required(),
  email: Joi.string().email().required(),
  aadhaar: Joi.number().required(),
  gender: Joi.string().required(),
  address: Joi.string().required(),
  standard: Joi.string().required(),
  medium: Joi.string().allow(null),
  otherMedium: Joi.string().allow(null),
  board: Joi.string().required(),
  school: Joi.string().required(),
  schoolAddress: Joi.string().required(),
  isActive: Joi.boolean().optional(),
  contact: Joi.number().required(),
  created_UserId: Joi.string().optional(),
  updated_UserId: Joi.string().optional(),
});

export interface SignupDto {
  name: string;
  fatherName: string;
  UserName: string;
  password: string;
  email: string;
  aadhaar: number;
  gender: string;
  address: string;
  standard: string;
  medium?: string;
  otherMedium?: string;
  board: string;
  school: string;
  schoolAddress: string;
  contact: number;
  created_UserId: string;
  updated_UserId: string;
}
