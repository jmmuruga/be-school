import "reflect-metadata";
import express from "express";
import dotenv from "dotenv";
import cors from "cors";

import "./core/database/db";
import classRouter from "./Master/class_master/class.controller";
import groupRouter from "./Master/group_master/group.controller";
import markRouter from "./Master/mark_master/mark.controller";
import StreamRouter from "./Master/medium_master/medium.controller";
import schoolRouter from "./Master/school_master/school.controller";
import subjectRouter from "./Master/subject_master/subject.controller";
import signupRouter from "./Signup/signup.controller";
import userRouter from "./User-Profile/user.controller";
import objectquesRouter from "./Question bank/objective-question/objective-question.controller";
// import QuesGenerateRouter from "./Question bank/question-paper-generate/ques-paper-generate.controller";
import onlinetestRouter from "./Test Board/onlinetest.controller";
import StaffRouter from "./Staff-Profile/staff-Profile.controller";
import QuesGenerateRouter from "./Question bank/question-paper-generate/ques-paper-generate.controller";
import questionRouter from "./Question bank/question-prepare/questionpre.controller";
import signInRouter from "./sign-in/sign-in.controller";
import userRightRouter from "./User-Rights/user-rights.controller";
import studentscoreRouter from "./Student-Result/student-result.controller";
import logsRouter from "./logs/logs.controller";
import otpRouter from "./Generate_Otp/generate_otp.controller";
import studentexamreportRouter from "./student-exam-report/student-exam-report.controller";
const app = express();

dotenv.config();
const PORT = process.env.PORT || 5000;
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(cors());

let corsOptions = {
  origin: "*",
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  preflightContinue: false,
  optionsSuccessStatus: 204,
};

app.use("/classRouter", cors(corsOptions), classRouter);
app.use("/groupRouter", cors(corsOptions), groupRouter);
app.use("/markRouter", cors(corsOptions), markRouter);
app.use("/StreamRouter", cors(corsOptions), StreamRouter);
app.use("/schoolRouter", cors(corsOptions), schoolRouter);
app.use("/subjectRouter", cors(corsOptions), subjectRouter);
app.use("/signupRouter", cors(corsOptions), signupRouter);
app.use("/userRouter", cors(corsOptions), userRouter);
app.use("/signInRouter", cors(corsOptions), signInRouter);
app.use("/objectquesRouter", cors(corsOptions), objectquesRouter);
app.use("/questionRouter", cors(corsOptions), questionRouter);
app.use("/QuesGenerateRouter", cors(corsOptions), QuesGenerateRouter);
app.use("/onlinetestRouter", cors(corsOptions), onlinetestRouter);
app.use("/StaffRouter", cors(corsOptions), StaffRouter);
app.use("/userRightRouter", cors(corsOptions), userRightRouter);
app.use("/studentscoreRouter", cors(corsOptions), studentscoreRouter);
app.use("/logsRouter", cors(corsOptions), logsRouter);
app.use("/otpRouter", cors(corsOptions), otpRouter);
app.use("/studentexamreportRouter",cors(corsOptions),studentexamreportRouter);
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));
// app.use('/QuesGenerateRouter',cors(corsOptions),QuesGenerateRouter)
app.listen(PORT, () => console.log(`server upon port ${PORT}`));
