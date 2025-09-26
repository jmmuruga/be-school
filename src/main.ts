import "reflect-metadata";
import express from "express";
import dotenv from "dotenv";
import cors from "cors";

import "./core/database/db"
import classRouter from "./Master/class_master/class.controller";
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



app.listen(PORT, () => console.log(`server upon port ${PORT}`));




