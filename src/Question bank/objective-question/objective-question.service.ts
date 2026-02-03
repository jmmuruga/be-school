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
      if ((payload as any)[key] === null) (payload as any)[key] = "";
    });

    const validation = objectquesValidation.validate(payload);
    if (validation.error) {
      const logsPayload: logsDto = {
        UserId: Number(payload.created_UserId),
        UserName: null,
        statusCode: 400,
        Message: `Validation error: ${validation.error.details[0].message}`,
      };
      await InsertLog(logsPayload);

      return res.status(400).json({
        message: validation.error.details[0].message,
      });
    }

    const questionRepo = appSource.getRepository(objectiveques);
    const existing = await questionRepo.findOne({
      where: {
        ClassName_Id: payload.ClassName_Id,
        subjectName_Id: payload.subjectName_Id,
        Stream_Id: payload.Stream_Id,
        question: payload.question,
        Imagequestion: payload.Imagequestion,
      },
    });

    if (existing) {
      const logsPayload: logsDto = {
        UserId: Number(payload.created_UserId),
        UserName: null,
        statusCode: 409,
        Message: `Question already exists - ${payload.question}`,
      };
      await InsertLog(logsPayload);

      return res.status(409).json({
        ErrorMessage: "This question already exists!",
      });
    }
    const result = await questionRepo
      .createQueryBuilder("q")
      .select("MAX(CAST(q.Question_Id AS INT))", "maxId")
      .where("q.ClassName_Id = :classId", {
        classId: payload.ClassName_Id,
      })
      .andWhere("q.subjectName_Id = :subjectId", {
        subjectId: payload.subjectName_Id,
      })
      .andWhere("q.Stream_Id = :streamId", {
        streamId: payload.Stream_Id,
      })
      .getRawOne();

    const nextQuestionId = (result?.maxId || 0) + 1;
    payload.Question_Id = nextQuestionId.toString();

  
    await questionRepo.save(payload);

    const logsPayload: logsDto = {
      UserId: Number(payload.created_UserId),
      UserName: null,
      statusCode: 200,
      Message: `Question added successfully`,
    };
    await InsertLog(logsPayload);

    return res.status(200).json({
      IsSuccess: true,
      Question_Id: payload.Question_Id,
      message: "Question added successfully",
    });
  } catch (error: any) {
    const logsPayload: logsDto = {
      UserId: Number(payload?.created_UserId || 0),
      UserName: null,
      statusCode: 500,
      Message: `Error while adding question - ${error.message}`,
    };
    await InsertLog(logsPayload);

    return res.status(500).json({
      message: "Internal server error",
      error: error.message,
    });
  }
};
