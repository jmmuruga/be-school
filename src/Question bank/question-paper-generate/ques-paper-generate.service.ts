import { Request, Response } from "express";
import { appSource } from "../../core/database/db";
import { QuesgenerateValidation } from "./ques-paper-generate.dto";
import { Quesgenerate } from "./ques-paper-generate.model";
import { QuesgenerateDto } from "./ques-paper-generate.dto";
import { objectiveques } from "../objective-question/objective-question.model";
import { objectivequesDto } from "../objective-question/objective-question.dto";
import { Question } from "../question-prepare/questionpre.model";
import { logsDto } from "../../logs/logs.dto";
import { InsertLog } from "../../logs/logs.service";
export const addQuesgene = async (req: Request, res: Response) => {
  const payload: QuesgenerateDto = req.body;
  try {
    const validation = QuesgenerateValidation.validate(payload);
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
    const QuesgenerateRepository = appSource.getRepository(Quesgenerate);
    await QuesgenerateRepository.save(payload);
    const logsPayload: logsDto = {
      UserId: Number(payload.created_UserId),
      UserName: null,
      statusCode: 200,
      Message: `QuesGenerate Print Successfully By - `,
    };
    await InsertLog(logsPayload);
    return res
      .status(200)
      .json({ IsSuccess: "QuesGenerate Print successfully" });
  } catch (error) {
    const logsPayload: logsDto = {
      UserId: Number(payload.created_UserId),
      UserName: null,
      statusCode: 500,
      Message: `Error while quesgenerate print  - ${error.message}`,
    };
    await InsertLog(logsPayload);
    return res.status(500).json({
      message: "Internal server error",
      error: error instanceof Error ? error.message : error,
    });
  }
};
export const getObjectiveQuestions = async (req: Request, res: Response) => {
  const { subject_Id, Class_Id, type, questionCount, oneMax } = req.params;
  try {
    const objectiveRepo = appSource.getRepository(objectiveques);

    const questions = await objectiveRepo.query(
      `SELECT TOP ${oneMax} *
        FROM [${process.env.DB_NAME}].[dbo].[objectiveques]
WHERE subjectName_Id = '${subject_Id}'
  AND ClassName_Id = '${Class_Id}'
  AND type = '${type}'
  
  ;`
    );
    return res.status(200).json({
      IsSuccess: "successfully",
      Result: questions,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Internal server error",
      error: error instanceof Error ? error.message : error,
    });
  }
};
export const getQuestionAns = async (req: Request, res: Response) => {
  try {
    const {
      subjectName_Id,
      ClassName_Id,
      type,
      twomark,
      threemark,
      fivemark,
      twoMax,
      threeMax,
      fiveMax,
    } = req.params;
    // console.log(req.params);
    // console.log("received twoMax ", twoMax);
    // console.log("received threeMax ", threeMax);
    // console.log("received fiveMax ", fiveMax);
    const quesAnsRepo = appSource.getRepository(Question);
    // Convert to number
    const twoUserMax = Number(twoMax);
    const threeUserMax = Number(threeMax);
    const fiveUserMax = Number(fiveMax);

    // 1️ Count DB totals for each mark
    const twoDb = await quesAnsRepo.count({
      where: { subjectName_Id, ClassName_Id, type, mark: 2 },
    });

    const threeDb = await quesAnsRepo.count({
      where: { subjectName_Id, ClassName_Id, type, mark: 3 },
    });

    const fiveDb = await quesAnsRepo.count({
      where: { subjectName_Id, ClassName_Id, type, mark: 5 },
    });

    // 2️ Calculate final MAX based on DB + User Max
    const finalTwoMax = Math.min(twoDb, twoUserMax);
    const finalThreeMax = Math.min(threeDb, threeUserMax);
    const finalFiveMax = Math.min(fiveDb, fiveUserMax);

    const query = `
      SELECT TOP ${finalTwoMax} * FROM question
      WHERE subjectName_Id = '${subjectName_Id}'
        AND ClassName_Id = '${ClassName_Id}'
        AND type = '${type}'
        AND mark = 2   
      UNION ALL

      SELECT TOP ${finalThreeMax} * FROM question
      WHERE subjectName_Id = '${subjectName_Id}'
        AND ClassName_Id = '${ClassName_Id}'
        AND type = '${type}'
        AND mark = 3
      UNION ALL

      SELECT TOP ${finalFiveMax} * FROM question
      WHERE subjectName_Id = '${subjectName_Id}'
        AND ClassName_Id = '${ClassName_Id}'
        AND type = '${type}'
        AND mark = 5 
    `;

    const questions = await quesAnsRepo.query(query);

    return res.status(200).json({
      IsSuccess: " Genarated  Question Paper Successfully ",
      Result: questions,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Internal server error",
      error: error instanceof Error ? error.message : error,
    });
  }
};
