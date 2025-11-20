import { Request, Response } from "express";
import { appSource } from "../../core/database/db";
import { QuesgenerateValidation } from "./ques-paper-generate.dto";
import { Quesgenerate } from "./ques-paper-generate.model";
import { QuesgenerateDto } from "./ques-paper-generate.dto";
import { objectiveques } from "../objective-question/objective-question.model";
import { objectivequesDto } from "../objective-question/objective-question.dto";
import { Question } from "../question-prepare/questionpre.model";
export const addQuesgene = async (req: Request, res: Response) => {
  try {
    const payload: QuesgenerateDto = req.body;
    const validation = QuesgenerateValidation.validate(payload);
    if (validation.error) {
      return res.status(400).json({
        message: validation.error.details[0].message,
      });
    }
    const QuesgenerateRepository = appSource.getRepository(Quesgenerate);
    await QuesgenerateRepository.save(payload);
    return res
      .status(200)
      .json({ IsSuccess: "QuesGenerate Print successfully" });
  } catch (error) {
    console.log(error);
  }
};
export const getObjectiveQuestions = async (req: Request, res: Response) => {
  try {
    const { subject, standard, type, questionCount, oneMax } = req.params;
    console.log(req.params);
    console.log("received oneMax ", oneMax);
    const objectiveRepo = appSource.getRepository(objectiveques);

    const questions = await objectiveRepo.query(
      `SELECT TOP ${oneMax} *
        FROM objectiveques
WHERE subject = '${subject}'
  AND standard = '${standard}'
  AND type = '${type}';`
    );
    return res.status(200).json({
      IsSuccess: "successfully",
      Result: questions,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Something went wrong" });
  }
};
export const getQuestionAns = async (req: Request, res: Response) => {
  try {
    const {
      subject,
      standard,
      type,
      twomark,
      threemark,
      fivemark,
      twoMax,
      threeMax,
      fiveMax,
    } = req.params;
    console.log(req.params);
    console.log("received twoMax ", twoMax);
    console.log("received threeMax ", threeMax);
    console.log("received fiveMax ", fiveMax);

    const quesAnsRepo = appSource.getRepository(Question);
    // Convert to number
    const twoUserMax = Number(twoMax);
    const threeUserMax = Number(threeMax);
    const fiveUserMax = Number(fiveMax);

    // 1️⃣ Count DB totals for each mark
    const twoDb = await quesAnsRepo.count({
      where: { subject, standard, type, mark: 2 },
    });

    const threeDb = await quesAnsRepo.count({
      where: { subject, standard, type, mark: 3 },
    });

    const fiveDb = await quesAnsRepo.count({
      where: { subject, standard, type, mark: 5 },
    });

    // 2️⃣ Calculate final MAX based on DB + User Max
    const finalTwoMax = Math.min(twoDb, twoUserMax);
    const finalThreeMax = Math.min(threeDb, threeUserMax);
    const finalFiveMax = Math.min(fiveDb, fiveUserMax);

    // console.log("Final max limits:", { finalTwoMax, finalThreeMax, finalFiveMax });

    const query = `
      SELECT TOP ${finalTwoMax} * FROM question
      WHERE subject = '${subject}'
        AND standard = '${standard}'
        AND type = '${type}'
        AND mark = 2
      
      UNION ALL

      SELECT TOP ${finalThreeMax} * FROM question
      WHERE subject = '${subject}'
        AND standard = '${standard}'
        AND type = '${type}'
        AND mark = 3
      UNION ALL

      SELECT TOP ${finalFiveMax} * FROM question
      WHERE subject = '${subject}'
        AND standard = '${standard}'
        AND type = '${type}'
        AND mark = 5 
    `;

    const questions = await quesAnsRepo.query(query);

    return res.status(200).json({
      IsSuccess: " Genarated  Question Paper Successfully ",
      Result: questions,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Internal server error",
      error: error instanceof Error ? error.message : error,
    });
  }
};
