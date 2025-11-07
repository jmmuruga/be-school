import { appSource } from "../core/database/db";
import { SignInDto, SignInvalidation } from "./sign-in.dto";
import { Request, Response } from "express";
import { SignIn } from "./sign-in.model";
import { User } from "../User-Profile/user.model";
export const signIn = async (req: Request, res: Response) => {
  const payload = req.body;
  const userRepository = appSource.getRepository(User);
  let user = await userRepository.findOneBy({ email: payload.email });
  if (!user) {
    user = await userRepository.findOneBy({ phone: payload.email });
  }
  if(!user){
    return res.status(401).send({
        message:"user Does Not Exist"
    });
  }
  try {
    const encryptedPassword = await (payload.password);
    if (user.password != encryptedPassword) {
         return res.status(401).send({
        message: "Invalid password. Please try again.",
      });
    }
  } catch (error: any) {
    return res.status(500).send({ error: "Internal Server Error" });
  }
};
