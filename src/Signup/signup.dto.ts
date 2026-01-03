import * as Joi from "joi";

export const SignupValidation = Joi.object({
  name: Joi.string().required(),
  fatherName: Joi.string().required(),
  UserName: Joi.string().required(),
  password: Joi.string().required(),
  confirmPassword: Joi.string().required(),
  email: Joi.string().email().required(),
  aadhaar: Joi.number().required(),
  dateOfBirth:Joi.string().required(),
  gender: Joi.string().required(),
  address: Joi.string().required(),
  Class_Id: Joi.string().required(),
  Stream_Id: Joi.string().allow("", null),
  otherStream: Joi.when("medium_Id", {
    is: "Other",
    then: Joi.string().required().messages({
      "string.empty": "Please specify the other stream",
    }),
    otherwise: Joi.string().allow("", null),
  }),
  board: Joi.string().required(),
  school: Joi.string().required(),
  schoolAddress: Joi.string().required(),
  contact: Joi.string().required(),
  // created_UserId: Joi.string().required(),
  updated_UserId: Joi.string().optional().allow(null , ""),
});

export interface SignupDto {
  name: string;
  fatherName: string;
  UserName: string;
  password: string;
  confirmPassword: string;
  email: string;
  aadhaar: string;
  gender: string;
  dateOfBirth:string;
  address: string;
  Class_Id: string;
  Stream_Id?: string;
  otherScheme?: string;
  board: string;
  school: string;
  schoolAddress: string;
  contact: string;
  // created_UserId: string;
  updated_UserId: string;
}