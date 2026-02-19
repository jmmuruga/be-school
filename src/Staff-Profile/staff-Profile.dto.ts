import * as Joi from "joi";
export const StaffValidation = Joi.object({
  staffNo: Joi.number().required(),
  staffName: Joi.string().required(),
  Gender: Joi.string().required(),
  qualification: Joi.string().required(),
  MajorSubject: Joi.string().required(),
  yearOfExperience: Joi.string().required(),
  classOfHandle: Joi.string().required(),
  email: Joi.string().required(),
  contactNo: Joi.string().required(),
  isActive: Joi.boolean().optional(),
      updateStatus:Joi.boolean().optional(),
  created_UserId: Joi.string().required(),
  updated_UserId: Joi.string().optional().allow(null , ""),
  loginUserName: Joi.string().optional().allow(null , ""),

});
export interface StaffDto {
  staffNo: number;
  staffName: string;
  Gender: string;
  qualification: string;
  yearOfExperience: string;
  email: string;
  contactNo: string;
  MajorSubject: string;
  classOfHandle: string;
  isActive: boolean;
  updateStatus:boolean;
  created_UserId: string;
  updated_UserId: string;
  loginUserName?:string;
}
export interface StaffStatus{
  staffNo : number;
  status : boolean;
    loginUserId: number;  
  loginUserName:string;
}