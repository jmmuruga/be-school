import { NextFunction } from "express";
import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import { UnauthenticatedException } from "../exceptions/ValidationException";
import { appSource } from "../core/database/db";
import { User } from "../User-Profile/user.model";
import crypto from "crypto";
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
//function to encrypt string
export function encryptString(data: string, secreatKet: string) {
   const algorithm = process.env.algorithm;
   const key = Buffer.from(
   "52d1542a9ee07bb807375a552983abf2386dc5e1e7ddc66dfb78b3c8533ee63b",
   "hex"
  );
  const iv = Buffer.from("ef953c62cfcff791f31efe8cd91ac20d", "hex");
  const cipher = crypto.createCipheriv(algorithm, Buffer.from(key), iv);
  let encryptData = cipher.update(data, "utf-8", "hex");
  encryptData += cipher.final("hex");
  return encryptData;
}
//function to decrypt date
export function decrypter(encryptedDate: string): string {
   try {
    const algorithm = process.env.algorithm;
    const key = Buffer.from(
   "52d1542a9ee07bb807375a552983abf2386dc5e1e7ddc66dfb78b3c8533ee63b",
   "hex"
  );
  const iv = Buffer.from("ef953c62cfcff791f31efe8cd91ac20d", "hex");
  const decipher = crypto.createDecipheriv(algorithm, key, iv);
  let decryptedDate = decipher.update(encryptedDate, "hex", "utf8");
  decryptedDate += decipher.final("utf8");
  return decryptedDate;
} catch (err) {
    // If decrypt fails → assume it's plain text
    return encryptedDate;
  }
}

