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
//       const existing = await questionRepoistry.findOne({
//       where: {
//   standard: payload.standard,
//   subject: payload.subject,
//   type: payload.type,
// }

//     });

//     if (existing) {
//       console.log("Duplicate found, updating instead…",payload);
//       return res.status(409).json({
//         ErrorMessage: "This question already exists!",
//       });
//     }

    await questionRepoistry.save(payload);
    console.log("Received payload:", payload);
    return res.status(200).json({ IsSuccess: "Question added successfully" });
  } catch (error) {
    console.log(error , 'error')
     return res.status(500).json({
      message: "Internal server error",
      error: error instanceof Error ? error.message : error,
    });
  }
};