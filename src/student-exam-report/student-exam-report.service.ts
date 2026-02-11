import { appSource } from "../core/database/db";
import { Request, Response } from "express";
import {
  studentexamReportDto,
  studentexamreportValidation,
} from "./student-exam-report.dto";
import { studentexamReport } from "./student-exam-report.model";

export const addStudentExamReport = async (req: Request, res: Response) => {
  try {

    const payload = req.body;   

    const data = payload[0];
    const result = await appSource.query(
      `SELECT ISNULL(MAX(Test_No),0) AS TestNo
       FROM [${process.env.DB_NAME}].[dbo].[studentexam_report]
       WHERE StudentId='${data.StudentId}'
         AND subjectName_Id='${data.subjectName_Id}'
         AND TestType='${data.TestType}'`
    );

    const newTestNo = (Number(result[0].TestNo) + 1).toString();

    payload.forEach((item:any) => {
      item.Test_No = newTestNo;
    });

    await appSource
      .getRepository(studentexamReport)
      .save(payload);

    return res.status(200).json({
      IsSuccess: "Student Exam Report Saved Successfully",
    });

  } catch (error) {
    return res.status(500).json({
      ErrorMessage: "Error while saving Student Exam Report",
      error: error instanceof Error ? error.message : error,
    });
  }
};
