import * as Joi from 'joi';

export const GroupValidation = Joi.object({
  groupCode: Joi.number().required(),
  groupoption: Joi.string().required(),
  groupName: Joi.string().required(),
  groupDescription: Joi.string().required(),
  isActive: Joi.boolean().optional(),
  created_UserId: Joi.string().optional(),
  updated_UserId: Joi.string().optional(),

});

export interface GroupDto {
  groupCode: number;
  groupoption: string;
  groupName: string;
  groupDescription: string;
  isActive: boolean;
  created_UserId: string;
  updated_UserId: string;
}