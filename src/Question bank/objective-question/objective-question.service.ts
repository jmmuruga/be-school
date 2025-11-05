import { appSource } from "../../core/database/db";
import { objectivequesDto } from "./objective-question.dto";
import { objectquesValidation } from "./objective-question.dto";
import { Response, Request } from "express";
import { objectiveques } from "./objective-question.model";
export const addObjectiveques = async (req: Request, res: Response) => {
  try {
    const payload: objectivequesDto = req.body;
    const validation = objectquesValidation.validate(payload);
    if (validation.error) {
      return res.status(400).json({
        message: validation.error.details[0].message,
      });
    }
    const questionRepoistry = appSource.getRepository(objectiveques);

    await questionRepoistry.save(payload);
    return res.status(200).json({ IsSuccess: "Question added successfully" });
  } catch (error) {
    console.log(error);
  }
};
