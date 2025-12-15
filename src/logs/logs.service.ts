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
    payload.UserName = userDetail?.userName || '-';
  }

  payload.Message = payload.Message + payload.UserName;
  // const userDetail = await userRepository.findBy({ UserID: payload.UserId });
  // const userName = userDetail[0]?.userName || "-";
  // payload.UserName = userName;
  //  payload.Message = payload.Message + payload.UserName;
  await logsRepository.save(payload);
};
export const sendLogs = async (req: Request, res: Response) => {
  try{
    const requestedPayload : logsDto = req.body;
    await InsertLog(requestedPayload);
    res.status(200).send({
      IsSuccess: "Success",
  });
  }
  catch (error) {
    if (error instanceof ValidationException) {
        return res.status(400).send({
            message: error?.message,
        });
    }
    res.status(500).send(error);
}
}
export const getLogs = async (req: Request, res: Response) => {
  try {
    const { userId, fromDate, toDate, companyId, pageNumber, limit } = req.query;
    const logsRepository = appSource.getRepository(logs);
    // Create a query builder
    const queryBuilder = logsRepository.createQueryBuilder('logs');
    // Add conditions
    if (userId && +userId > 0) {
      queryBuilder.where('logs.userId = :userId', { userId });
    }
    if (companyId && +companyId > 0) {
      queryBuilder.where('logs.companyId = :companyId', { companyId });
    }
    if (fromDate !== 'null' && toDate !== 'null' && userId == 'null' && companyId == 'null') {
      queryBuilder.where('CAST(logs.created_at AS DATE) BETWEEN CAST(:fromDate AS DATE) AND CAST(:toDate AS DATE)', { fromDate, toDate });
    }
    if (fromDate !== 'null' && toDate !== 'null' && userId && companyId == 'null') {
      queryBuilder.andWhere('CAST(logs.created_at AS DATE) BETWEEN CAST(:fromDate AS DATE) AND CAST(:toDate AS DATE)', { fromDate, toDate });
    }
    if (fromDate !== 'null' && toDate !== 'null' && userId == 'null' && companyId) {
      queryBuilder.andWhere('CAST(logs.created_at AS DATE) BETWEEN CAST(:fromDate AS DATE) AND CAST(:toDate AS DATE)', { fromDate, toDate });
    }
    // Set pagination
    queryBuilder
      .orderBy('logs.created_at', 'DESC')
    // Execute the query
    const userLogDetails = await queryBuilder.getMany();
    // const page = +pageNumber;
    // const perPageLimit = +limit;
    // const startIndex = (page - 1) * perPageLimit;
    // const endIndex = page * perPageLimit;
    // const paginatedResult = userLogDetails.slice(startIndex , endIndex);
    res.status(200).send({
      Result: userLogDetails,
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