import "reflect-metadata";
import express from "express";
import dotenv from "dotenv";
import cors from "cors";

import "./core/database/db"
import classRouter from "./Master/class_master/class.controller";
import groupRouter from "./Master/group_master/group.controller";
import markRouter from "./Master/mark_master/mark.controller";
import mediumRouter from "./Master/medium_master/medium.controller";
import schoolRouter from "./Master/school_master/school.controller";
import subjectRouter from "./Master/subject_master/subject.controller";
import signupRouter from "./Signup/signup.controller";
import userRouter from "./User-Profile/user.controller";
import objectquesRouter from "./Question bank/objective-question/objective-question.controller";
import QuesGenerateRouter from "./Question bank/question-paper-generate/ques-paper-generate.controller";
import onlinetestRouter from "./Test Board/onlinetest.controller";
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

// place cors here
app.use('/classRouter' , cors(corsOptions) , classRouter);
app.use('/groupRouter',cors(corsOptions),groupRouter);
app.use('/markRouter',cors(corsOptions),markRouter);
app.use('/mediumRouter',cors(corsOptions),mediumRouter);
app.use('/schoolRouter',cors(corsOptions),schoolRouter);
app.use('/subjectRouter',cors(corsOptions),subjectRouter);
app.use('/signupRouter',cors(corsOptions),signupRouter);
app.use('/userRouter',cors(corsOptions),userRouter);
app.use('/objectquesRouter',cors(corsOptions),objectquesRouter);
app.use('/onlinetestRouter',cors(corsOptions),onlinetestRouter);
// app.use('/QuesGenerateRouter',cors(corsOptions),QuesGenerateRouter)
app.listen(PORT, () => console.log(`server upon port ${PORT}`));




