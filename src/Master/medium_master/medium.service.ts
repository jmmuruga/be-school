import { appSource } from "../../core/database/db";
import { StreamDto, StreamStatus, StreamValidation } from "./medium.dto";
import { Request, Response } from "express";
import { StreamMaster } from "./medium.model";
import StreamRouter from "./medium.controller";
import { Not } from "typeorm";
import { InsertLog } from "../../logs/logs.service";
import { logsDto } from "../../logs/logs.dto";

export const addStream = async (req: Request, res: Response) => {
  const payload: StreamDto = req.body;
  try {
    //check validation
    const validation = StreamValidation.validate(payload);
    if (validation.error) {
      const logsPayload: logsDto = {
        UserId: Number(payload.created_UserId),
        UserName: null,
        statusCode: 500,
        Message: `Validation error: ${validation.error.details[0].message}`,
      };
      await InsertLog(logsPayload);
      return res.status(400).json({
        message: validation.error.details[0].message,
      });
    }
    const StreamRepoistry = appSource.getRepository(StreamMaster);
    const existingStream = await StreamRepoistry.findOneBy({
      Stream: payload.Stream,
    });

    if (existingStream) {
      const logsPayload: logsDto = {
        UserId: Number(payload.created_UserId),
        UserName: null,
        statusCode: 500,
        Message: `Error while saving Stream - ${payload.Stream} (Stream already exists) -`,
      };
      await InsertLog(logsPayload);
      return res.status(400).json({
        ErrorMessage: "This Stream is already Existing !!",
      });
    }
    await StreamRepoistry.save(payload);

    const logsPayload: logsDto = {
      UserId: Number(payload.created_UserId),
      UserName: null,
      statusCode: 200,
      Message: `Added StreamMaster - Stream (${payload.Stream})  Successfully By - `,
    };
    await InsertLog(logsPayload);
    return res.status(200).json({ IsSuccess: "Stream Added Successfully !!" });
  } catch (error) {
    const logsPayload: logsDto = {
      UserId: Number(payload.created_UserId),
      UserName: null,
      statusCode: 500,
      Message: `Error while adding  Stream  - ${error.message}`,
    };
    await InsertLog(logsPayload);
    return res.status(500).json({
      message: "Internal server error",
      error: error instanceof Error ? error.message : error,
    });
  }
};
export const getStreamId = async (req: Request, res: Response) => {
  try {
    const StreamRepositry = appSource.getRepository(StreamMaster);
    let Stream_Id = await StreamRepositry.query(
      `SELECT Stream_Id
            FROM [${process.env.DB_NAME}].[dbo].[Stream_master] 
            Group by Stream_Id
            ORDER BY CAST(Stream_Id AS INT) DESC;`
    );
    let id = "0";
    if (Stream_Id?.length > 0) {
      id = Stream_Id[0].Stream_Id;
    }
    const finalRes = Number(id) + 1;
    res.status(200).send({
      Result: finalRes,
    });
  } catch (error) {
    // console.log(error);
    return res.status(500).json({
      message: "Internal server error",
      error: error instanceof Error ? error.message : error,
    });
  }
};
export const getStreamDetails = async (req: Request, res: Response) => {
  try {
    const StreamRepoistry = appSource.getRepository(StreamMaster);
    const StreamM = await StreamRepoistry.find({
      where: { isActive: true },
    });
    // const StreamM = await StreamRepoistry.createQueryBuilder("").getMany();
    res.status(200).send({
      Result: StreamM,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Internal server error",
      error: error instanceof Error ? error.message : error,
    });
  }
};
export const updateStream = async (req: Request, res: Response) => {
  const payload: StreamDto = req.body;
  try {
    //check validation
    const validation = StreamValidation.validate(payload);
    if (validation.error) {
      const logsPayload: logsDto = {
        UserId: Number(payload.created_UserId),
        UserName: null,
        statusCode: 500,
        Message: `Validation error: ${validation.error.details[0].message}`,
      };
      await InsertLog(logsPayload);
      return res.status(400).json({
        message: validation.error.details[0].message,
      });
    }
    // check whether Stream exist code

    const StreamRepoistry = appSource.getRepository(StreamMaster);
    const existingStream = await StreamRepoistry.findOneBy({
      Stream_Id: payload.Stream_Id,
    });
    if (!existingStream) {
      const logsPayload: logsDto = {
        UserId: Number(payload.created_UserId),
        UserName: null,
        statusCode: 404,
        Message: `Update Stream Failed - Stream_Id ${payload.Stream_Id} not found`,
      };
      await InsertLog(logsPayload);
      return res.status(400).json({
        ErrorMessage: "Stream Doesn't exist",
      });
    }
    // check Stream  already exists
    const StreamExist = await StreamRepoistry.findBy({
      Stream: payload.Stream,
      Stream_Id: Not(payload.Stream_Id),
    });
    if (StreamExist.length > 0) {
      const logsPayload: logsDto = {
        UserId: Number(payload.created_UserId),
        UserName: null,
        statusCode: 500,
        Message: `Error while update Stream - ${payload.Stream} (Stream Name already exists) -`,
      };
      await InsertLog(logsPayload);
      return res.status(400).json({
        ErrorMessage: "This Stream is  Already  Existing !!",
      });
    }
    await StreamRepoistry.update({ Stream_Id: payload.Stream_Id }, payload);

    const logsPayload: logsDto = {
      UserId: Number(payload.created_UserId),
      UserName: null,
      statusCode: 200,
      Message: `Updated Stream Master - Stream_Id : ${existingStream.Stream_Id}, old Stream name :${existingStream.Stream} to new Stream :${payload.Stream} Successfully By - `,
    };
    await InsertLog(logsPayload);

    return res
      .status(200)
      .json({ IsSuccess: "Stream Updated Successfully !!" });
  } catch (error) {
    const logsPayload: logsDto = {
      UserId: Number(payload.created_UserId),
      UserName: null,
      statusCode: 500,
      Message: `Error while  update Stream  - ${error.message}`,
    };
    await InsertLog(logsPayload);
    return res.status(500).json({
      message: "Internal server error",
      error: error instanceof Error ? error.message : error,
    });
  }
};
export const deleteStream = async (req: Request, res: Response) => {
  const Stream_Id = Number(req.params.Stream_Id);
  const { loginUserId, loginUserName } = req.body;
  try {
    if (isNaN(Stream_Id)) {
      const logsPayload: logsDto = {
        UserId: loginUserId,
        UserName: loginUserName,
        statusCode: 500,
        Message: `Validation error: Invalid Stream Code (${req.params.Stream_Id})`,
      };
      await InsertLog(logsPayload);
      return res.status(400).json({
        ErrorMessage: "Invalid class code",
      });
    }
    const StreamRepoistry = appSource.getRepository(StreamMaster);
    // Check whether StreamId exists
    const existingStream = await StreamRepoistry.findOneBy({
      Stream_Id:Stream_Id,
    });
    if (!existingStream) {
      const logsPayload: logsDto = {
        UserId: loginUserId,
        UserName: loginUserName,
        statusCode: 404,
        Message: ` Stream Failed - Stream Id ${Stream_Id} not found`,
      };
      await InsertLog(logsPayload);

      return res.status(400).json({
        ErrorMessage: "Stream Id  not found",
      });
    }
    //delete and active
    await StreamRepoistry
      .createQueryBuilder()
      .update(StreamMaster)
      .set({ isActive: false })
      .where({ Stream_Id: Stream_Id })
      .execute();

    const logsPayload: logsDto = {
      UserId: loginUserId,
      UserName: loginUserName,
      statusCode: 200,
      Message: `Deleted Successfully in  Stream Master Stream( ${existingStream.Stream}) By - `,
    };
    await InsertLog(logsPayload);
    return res.status(200).json({
      IsSuccess: "Stream Deleted successfully !!",
    });
  } catch (error) {
    const logsPayload: logsDto = {
      UserId: loginUserId,
      UserName: loginUserName,
      statusCode: 500,
      Message: `Error while delete Stream  - ${error.message}`,
    };
    await InsertLog(logsPayload);
    return res.status(500).json({
      message: "Internal server error",
      error: error instanceof Error ? error.message : error,
    });
  }
};
export const updateStreamStatus = async (req: Request, res: Response) => {
  const payload: StreamStatus = req.body;
  try {
    const StreamRepoistry = appSource.getRepository(StreamMaster);
    const existingStream = await StreamRepoistry.findOneBy({
      Stream_Id: payload.Stream_Id,
    });
    if (!existingStream) {
      const logsPayload: logsDto = {
        UserId: payload.loginUserId,
        UserName: payload.loginUserName,
        statusCode: 500,
        Message: `Validation Error: Invalid Stream Code (${payload.Stream_Id})`,
      };
      await InsertLog(logsPayload);
      return res.status(400).json({
        ErrorMessage: "Stream not found",
      });
    }
    await StreamRepoistry
      .createQueryBuilder()
      .update(StreamMaster)
      .set({ status: payload.status })
      .where({ Stream_Id: payload.Stream_Id })
      .execute();

    const logsPayload: logsDto = {
      UserId: payload.loginUserId,
      UserName: payload.loginUserName,
      statusCode: 200,
      Message: `Changed  Stream Status for  ${existingStream.Stream} Stream to ${payload.status} By - `,
    };
    await InsertLog(logsPayload);
    return res
      .status(200)
      .json({ IsSuccess: "Stream Status updated Successfully !" });
  } catch (error) {
    const logsPayload: logsDto = {
      UserId: payload.loginUserId,
      UserName: payload.loginUserName,
      statusCode: 500,
      Message: ` Error while updating Stream status: ${error.message}`,
    };
    await InsertLog(logsPayload);
    return res.status(500).json({
      message: "Internal server error",
      error: error instanceof Error ? error.message : error,
    });
  }
};
