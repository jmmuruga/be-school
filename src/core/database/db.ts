import "dotenv/config";
import "reflect-metadata";
import { DataSource } from "typeorm";

// 1. Double check these import names match the 'export class X' in each file
import { GroupMaster } from "../../Master/group_master/group.model";
import { classMaster } from "../../Master/class_master/class.model";
import { SchoolMaster } from "../../Master/school_master/school.model";
import { MarkMaster } from "../../Master/mark_master/mark.model";
import { StreamMaster } from "../../Master/medium_master/medium.model";
import { SubjectMaster } from "../../Master/subject_master/subject.model";
import { Signup } from "../../Signup/signup.model";
import { User } from "../../User-Profile/user.model";
import { Quesgenerate } from "../../Question bank/question-paper-generate/ques-paper-generate.model";
import { Staff } from "../../Staff-Profile/staff-Profile.model";
import { objectiveques } from "../../Question bank/objective-question/objective-question.model";
import { SignIn } from "../../sign-in/sign-in.model";
import { Question } from "../../Question bank/question-prepare/questionpre.model";
import { onlinetest } from "../../Test Board/onlinetest.model";
import { UserRight } from "../../User-Rights/user-rights.model";
import { studentScoreResult } from "../../Student-Result/student-result.model";
import { logs } from "../../logs/logs.model";
import { Generate_Otp } from "../../Generate_Otp/generate_otp.model";
import { studentexamReport } from "../../student-exam-report/student-exam-report.model";
const Entities : any = [classMaster , GroupMaster,SchoolMaster,MarkMaster,StreamMaster,SubjectMaster,User,Staff,Signup,objectiveques,
    Quesgenerate,SignIn,Question,onlinetest,UserRight,studentScoreResult,logs,Generate_Otp,studentexamReport
]

export const appSource = new DataSource({
  type: "mssql",
  host: process.env.DB_SERVER, 
  port: parseInt(process.env.DB_PORT || "1436"), 
  username: process.env.DB_USER, 
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  entities: Entities,
  synchronize: false, 
  logging: false,
  options: {
    encrypt: false, 
    trustServerCertificate: true,
  },
  extra: {
    trustServerCertificate: true,
    requestTimeout: 60000
  },
});

appSource
  .initialize()
  .then(() => console.log("SQL Server Connected"))
  .catch((error) => console.log(error, "Error while connecting to DB"));
