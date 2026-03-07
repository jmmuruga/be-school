import { NextFunction } from "express";
import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import { UnauthenticatedException } from "../exceptions/ValidationException";
import { appSource } from "../core/database/db";
import { User } from "../User-Profile/user.model";
export const auth = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const bearerToken = req.headers.authorization?.split("Bearer ")[1];

    if (!bearerToken) {
      throw new UnauthenticatedException("Unauthenticated access");
    }

    const jwtVerification = jwt.verify(
      bearerToken,
      process.env.JWT_SECRET_KEY as string,
    );

    if (typeof jwtVerification === "string" || !jwtVerification) {
      throw new UnauthenticatedException("Unauthenticated access");
    }
    const userRepository = appSource.getRepository(User);

    const user = await userRepository.findOneBy({
      UserID: jwtVerification?.UserID,
    });
    if (!user) {
      throw new UnauthenticatedException("Unauthenticated access");
    }
    res.locals.user = user;
    next();
  } catch (error) {
    res.status(401).send({ message: "Unauthenticated" });
  }
};
