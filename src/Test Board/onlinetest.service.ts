import { appSource } from "../core/database/db";
import { Request, Response } from "express";
import { onlinetest } from "./onlinetest.model";
import { onlinetestDto, OnlineTestValidation } from "./onlinetest.dto";
export const addOnlinetest = async (req: Request, res: Response) => {
  try {
    const payload: onlinetestDto = req.body;
    const validation = OnlineTestValidation.validate(payload);
    if (validation.error) {
      return res.status(400).json({
        message: validation.error.details[0].message,
      });
    }
    const onlinetestRepoistry = appSource.getRepository(onlinetest);
    await onlinetestRepoistry.save(payload);
    return res.status(200).json({ IsSuccess: "Start successfully" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Internal server error",
      error: error instanceof Error ? error.message : error,
    });
  }
};
