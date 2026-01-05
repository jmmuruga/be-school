import { Generate_Otp } from "./generate_otp.model";
import { appSource } from "../core/database/db";

export const saveOtpForStudent = async (studentId: number, otp: number) => {
  const otpRepository = appSource.getRepository(Generate_Otp);

  const enterOtp = otpRepository.create({
    studentId: studentId,
    Generate_Otp: otp,
  });

  await otpRepository.save(enterOtp);
  return enterOtp;
};