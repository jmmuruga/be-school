import { Request, Response } from "express";
import { logs } from "./logs.model";
import { logsDto } from "./logs.dto";
import { appSource } from "../core/database/db";
import { User } from "../User-Profile/user.model";
import { ValidationException } from "../exceptions/ValidationException";

export const InsertLog = async (payload: logsDto): Promise<void> => {
  const logsRepository = appSource.getRepository(logs);
  const userRepository = appSource.getRepository(User);
  if (!payload.UserName) {
    const userDetail = await userRepository.findOneBy({
      UserID: payload.UserId,
    });
    payload.UserName = userDetail?.userName || "-";
  }

  payload.Message = payload.Message + payload.UserName;
  await logsRepository.save(payload);
};
export const sendLogs = async (req: Request, res: Response) => {
  try {
    const requestedPayload: logsDto = req.body;
    await InsertLog(requestedPayload);
    res.status(200).send({
      IsSuccess: "Success",
    });
  } catch (error) {
    if (error instanceof ValidationException) {
      return res.status(400).send({
        message: error?.message,
      });
    }
    res.status(500).send(error);
  }
};
export const getLogs = async (req: Request, res: Response) => {
  try {
    const { fromDate, toDate } = req.params;

    const logsRepository = appSource.getRepository(logs);
    const logReports = await logsRepository.query(
      `select UserId,UserName,statusCode,Message,created_at from [${process.env.DB_NAME}].[dbo].[logs]
     where CONVERT(DATE, created_at) >= '${fromDate}'
   AND  CONVERT(DATE, created_at) <= '${toDate}'
   order by logId desc`
    );
    res.status(200).send({
      Result: logReports,
    });
  } catch (error) {
    if (error instanceof ValidationException) {
      return res.status(400).send({
        message: error?.message,
      });
    }
    res.status(500).send(error);
  }
};
