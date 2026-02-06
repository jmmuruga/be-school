import "dotenv/config";
import "reflect-metadata";
import { DataSource } from "typeorm"; // Ensure this line exists
import { GroupMaster } from "../../Master/group_master/group.model";
import { classMaster } from "../../Master/class_master/class.model";
// ... (all your other model imports)

// Explicitly define the Entities array with a type
const Entities: any[] = [
  classMaster, 
  GroupMaster,
  SchoolMaster,
  MarkMaster,
  StreamMaster,
  SubjectMaster,
  User,
  Staff,
  Signup,
  objectiveques,
  Quesgenerate,
  SignIn,
  Question,
  onlinetest,
  UserRight,
  studentScoreResult,
  logs,
  Generate_Otp
];

export const appSource = new DataSource({
  type: "mssql",
  host: process.env.DB_SERVER, 
  port: parseInt(process.env.DB_PORT || "1436"), 
  username: process.env.DB_USER, 
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  entities: Entities,
  synchronize: true, 
  logging: false,
  options: {
    encrypt: false, // Set to true if your SQL server uses SSL
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
