import * as Joi from 'joi';

export const GroupValidation = Joi.object({
  groupCode: Joi.number().required(),
  groupName: Joi.string().required(),
  groupDescription: Joi.string().required(),
  groupoption: Joi.string().required(),
  isActive: Joi.boolean().required(),
  created_UserId: Joi.string().required(),
  updated_UserId: Joi.string().required(),

});

export interface GroupDto {
  groupCode: number;
  groupName: string;
  groupDescription: string;
  groupoption: string;
  isActive: boolean;
  created_UserId: string;
  updated_UserId: string;
}