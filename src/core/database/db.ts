import "dotenv/config";
import "reflect-metadata";
import { DataSource } from "typeorm";
import { GroupMaster } from "../../Master/group_master/group.model";
import { classMaster } from "../../Master/class_master/class.model";
import { SchoolMaster } from "../../Master/school_master/school.model";
import { MarkMaster } from "../../Master/mark_master/mark.model";
import { StreamMaster } from "../../Master/medium_master/medium.model";
import { SubjectMaster } from "../../Master/subject_master/subject.model";
// import { Signup } from "../../Signup/signup.model";
import { Signup } from "../../Signup/signup.model";
import { User } from "../../User-Profile/user.model";

import { Quesgenerate } from "../../Question bank/question-paper-generate/ques-paper-generate.model";
import { Staff } from "../../Staff-Profile/staff-Profile.model";
import { objectiveques } from "../../Question bank/objective-question/objective-question.model";
import { SignIn } from "../../sign-in/sign-in.model";
import { Question } from "../../Question bank/question-prepare/questionpre.model";
import { onlinetest } from "../../Test Board/onlinetest.model";
import userRightRouter from "../../User-Rights/user-rights.controller";
import { UserRight } from "../../User-Rights/user-rights.model";
import { studentScoreResult } from "../../Student-Result/student-result.model";
import { logs } from "../../logs/logs.model";
import { Generate_Otp } from "../../Generate_Otp/generate_otp.model";
const Entities : any = [classMaster , GroupMaster,SchoolMaster,MarkMaster,StreamMaster,SubjectMaster,User,Staff,Signup,objectiveques,
    Quesgenerate,SignIn,Question,onlinetest,UserRight,studentScoreResult,logs,Generate_Otp
]

export const appSource = new DataSource({
    
  type: "mssql",
  host: process.env.DB_SERVER_HOST,
  port: parseInt(process.env.DB_PORT as string),
  // schema: 'Finance',
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  entities: Entities,
  synchronize: true,
  // autoLoadEntities: true,
  logging: false,
  pool: {
    max: 10,
    min: 0,
    idleTimeoutMillis: 30000
  },
  options: {
    cryptoCredentialsDetails: {
      minVersion: "TLSv1",
      trustServerCertificate: true,
    },
    encrypt: false
    // requestTimeout: 300000
  },
  extra: {
    trustServerCertificate: true,
    requestTimeout: 60000
  },
});
 
 appSource
  .initialize()
  .then((res) => console.log("SQL Server Connected"))
  .catch((error) => console.log(error, "Error while connecting to DB"));