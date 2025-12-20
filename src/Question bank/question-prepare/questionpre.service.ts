import { appSource } from "../../core/database/db";
import { QuestionDto, QuestionValidation } from "./questionpre.dto";
import { Response, Request } from "express";
import { Question } from "./questionpre.model";
import { InsertLog } from "../../logs/logs.service";
import { logsDto } from "../../logs/logs.dto";
export const addQuestion = async (req: Request, res: Response) => {
    const payload: QuestionDto = req.body;
  try {
    const validation = QuestionValidation.validate(payload);
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
    const questionRepoistry = appSource.getRepository(Question);
    const existing = await questionRepoistry.findOne({
      where: {
        standard: payload.standard,
        subject: payload.subject,
        type: payload.type,
        mark: payload.mark,
        question: payload.question,
      },
    });

    if (existing) {
      const logsPayload: logsDto = {
        UserId: Number(payload.created_UserId),
        UserName: null,
        statusCode: 500,
        Message: `Error while add question - ${payload.question} (This question already exists) -`,
      };
      await InsertLog(logsPayload);
      return res.status(409).json({
        ErrorMessage: "This question already exists!",
      });
    }
    await questionRepoistry.save(payload);
    const logsPayload: logsDto = {
      UserId: Number(payload.created_UserId),
      UserName: null,
      statusCode: 200,
      Message: `Question  Added Successfully By - `,
    };
    await InsertLog(logsPayload);

    return res.status(200).json({ IsSuccess: "Question added successfully" });
  } catch (error) {
    // console.log(error);
    return res.status(500).json({
      message: "Internal server error",
      error: error instanceof Error ? error.message : error,
    });
  }
};
