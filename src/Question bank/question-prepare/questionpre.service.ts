import { appSource } from "../../core/database/db";
import { QuestionDto, QuestionValidation } from "./questionpre.dto";
import { Response, Request } from "express";
import { Question } from "./questionpre.model";
export const addQuestion = async (req: Request, res: Response) => {
  try {
    const payload: QuestionDto = req.body;
    const validation = QuestionValidation.validate(payload);
    if (validation.error) {
      return res.status(400).json({
        message: validation.error.details[0].message,
      });
    }
    const questionRepoistry = appSource.getRepository(Question);
    await questionRepoistry.save(payload);
    return res.status(200).json({ message: "Question added successfully" });
  } catch (error) {
    console.log(error);
  }
};
