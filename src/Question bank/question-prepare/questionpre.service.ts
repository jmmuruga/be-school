import { appSource } from "../../core/database/db";
import { QuestionDto, QuestionValidation } from "./questionpre.dto";
import { Response, Request } from "express";
import { Question } from "./questionpre.model";
export const addQuestion = async (req: Request, res: Response) => {
  try {
    const payload: QuestionDto = req.body;
    // console.log(" Incoming Question Payload:", payload);
    const validation = QuestionValidation.validate(payload);
    // console.log(" Validation Result:", validation);
    if (validation.error) {
      console.log(validation.error, "validatiom error");
      return res.status(400).json({
        message: validation.error.details[0].message,
      });
    }

    const questionRepoistry = appSource.getRepository(Question);
    await questionRepoistry.save(payload);
    return res.status(200).json({ IsSuccess: "Question added successfully" });
  } catch (error) {
    // console.log(error);
    return res.status(500).json({
      message: "Internal server error",
      error: error instanceof Error ? error.message : error,
    });
  }
};
