import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import morgan from "morgan";
import bodyParser from "body-parser";
import xss from "xss-clean";
import mongoSanitize from "express-mongo-sanitize";

import { dbConnection } from "./dbConnection/dbConnection.js";
import { errorMiddleware } from "./utils/error.js";

import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import companyRoutes from "./routes/companyRoutes.js";
import jobRoutes from "./routes/jobRoutes.js";

const app = express();
dotenv.config({ path: "./config/config.env" });
const Port = process.env.PORT || 3000;

dbConnection();

app.use(
  cors({
    origin: process.env.FRONT_END_URL,
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);
app.use(xss());
app.use(mongoSanitize());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));

app.listen(Port, (error) => {
  try {
    console.log(`Server is Running on http://localhost:${Port}`);
  } catch (error) {
    console.log("Server Couldn't be Started");
  }
});

app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/users", userRoutes);
app.use("/api/v1/companies", companyRoutes);
app.use("/api/v1/jobs", jobRoutes);

app.use(errorMiddleware);
