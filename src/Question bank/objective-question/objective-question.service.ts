import { appSource } from "../../core/database/db";
import { objectivequesDto } from "./objective-question.dto";
import { objectquesValidation } from "./objective-question.dto";
import { Response, Request } from "express";
import { objectiveques } from "./objective-question.model";
import { InsertLog } from "../../logs/logs.service";
import { logsDto } from "../../logs/logs.dto";
export const addObjectiveques = async (req: Request, res: Response) => {
  const payload: objectivequesDto = req.body;
  try {
    Object.keys(payload).forEach((key) => {
      if (payload[key] === null) payload[key] = "";
    });
    const validation = objectquesValidation.validate(payload);
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
    const questionRepoistry = appSource.getRepository(objectiveques);

    const existing = await questionRepoistry.findOne({
      where: {
        ClassName_Id: payload.ClassName_Id,
        subjectName_Id: payload.subjectName_Id,
        type: payload.type,
        Stream_Id:payload.Stream_Id,
        question: payload.question,
        Imagequestion: payload.Imagequestion,
      },
    });

    if (existing) {
      const logsPayload: logsDto = {
        UserId: Number(payload.created_UserId),
        UserName: null,
        statusCode: 500,
        Message: `Error while saving questions - ${payload.question} (Question already exists) -`,
      };
      await InsertLog(logsPayload);
      return res.status(409).json({
        ErrorMessage: "This question already existing!",
      });
    }

    await questionRepoistry.save(payload);
    const logsPayload: logsDto = {
      UserId: Number(payload.created_UserId),
      UserName: null,
      statusCode: 200,
      Message: `Question Added Successfully By - `,
    };
    await InsertLog(logsPayload);
    return res.status(200).json({ IsSuccess: "Question added successfully" });
  } catch (error) {
    const logsPayload: logsDto = {
      UserId: Number(payload.created_UserId),
      UserName: null,
      statusCode: 500,
      Message: `Error while adding question - ${error.message}`,
    };
    await InsertLog(logsPayload);
    return res.status(500).json({
      message: "Internal server error",
      error: error instanceof Error ? error.message : error,
    });
  }
};
