import { Request, Response } from "express";
import { appSource } from "../../core/database/db";
import { QuesgenerateValidation } from "./ques-paper-generate.dto";
import { Quesgenerate } from "./ques-paper-generate.model";
import { QuesgenerateDto } from "./ques-paper-generate.dto";
import { objectiveques } from "../objective-question/objective-question.model";
import { objectivequesDto } from "../objective-question/objective-question.dto";
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
    const {
      subject,
      standard: standard,
      type: scheme,
      question: onemark,
    } = req.params;
    const objectiveRepo = appSource.getRepository(objectiveques);

    const question = await objectiveRepo.findOneBy({
      subject: subject,
      standard: standard,
      type: scheme,
      question: onemark,
    });

    if (!question) {
      return res.status(404).json({
        ErrorMessage: "One Mark Question Does Not Exist",
      });
    }
   return res.status(200).json({
  IsSuccess: "successfully",
  data: {
    subject: question.subject,
    standard: question.standard,
    type: question.type,
    question: question.question,
  },
});
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Something went wrong" });
  }
};
