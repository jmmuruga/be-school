import * as Joi from "joi";

export const SignupValidation = Joi.object({
    name: Joi.string().required(),
    fatherName: Joi.string().required(),
    UserName: Joi.string().required(),
    password: Joi.string().required(),
    email: Joi.string().email().required(),
    aadhaar: Joi.string().pattern(/^\d{12}$/).required(),
    gender: Joi.string().required(),
    address: Joi.string().required(),
    standard: Joi.string().required(),
    medium: Joi.string().allow(null),
    otherMedium: Joi.string().allow(null),
    board: Joi.string().required(),
    school: Joi.string().required(),
    schoolAddress: Joi.string().required(), 
      isActive: Joi.boolean().required(),
   contact: Joi.string().pattern(/^\d{10}$/).required(),
    created_UserId: Joi.string().required(),
    updated_UserId: Joi.string().required(),
})

export interface SignupDto {
    name: string;
    fatherName: string;
    UserName: string;
    password: string;
    email: string;
    aadhaar: string;
    gender: string;
    address: string;
    standard: string;
    medium?: string;
    otherMedium?: string;
    board: string;
    school: string;
    schoolAddress: string;
    contact: string;
    created_UserId: string;
    updated_UserId: string;
}
