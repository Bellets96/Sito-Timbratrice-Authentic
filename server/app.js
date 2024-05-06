import https from "https";
import http from "http";
import fs from "fs";
import express from "express";
import helmet from "helmet";
import "dotenv/config";
import cors from "cors";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";
import cron from "node-cron";

import authRouter from "./routes/authRouter.js";
import usersRouter from "./routes/usersRouter.js";
import timbratriceRouter from "./routes/timbratriceRouter.js";

import getAllTimbrature from "./scheduled/bonusSettimanali.js";

const PORT = process.env.PORT || 3000;
const MONGODB = process.env.MONGODB_URI;

const corsOptions = {
  origin: [
    "https://authenticremastered.it",
    "http://authenticremastered.it",
    "authenticremastered.it",
  ],
  credentials: true,
  preflightContinue: true,
  optionsSuccessStatus: 200,
};

//Express App
const app = express();

//Middleware
app.use(helmet());
app.use(express.json());
app.use(cors(corsOptions));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

//Routes
app.use("/auth", authRouter);
app.use("/users", usersRouter);
app.use("/timbratrice", timbratriceRouter);

//Scheduled
cron.schedule("0 4 * * 2", () => {
  // Esegue ogni martedì alle 04:00
  getAllTimbrature();
});

const options = {
  key: fs.readFileSync(process.env.SSL_KEY, "utf-8"),
  cert: fs.readFileSync(process.env.SSL_CERT, "utf-8"),
};

//DB Connection
mongoose
  .connect(MONGODB)
  .then(() => {
    // Avvia il server HTTP e HTTPS
    http.createServer(app).listen(3080),
      https.createServer(options, app).listen(PORT, () => {
        console.log(
          "Connessione a MongoDB avvenuta e server attivo in ascolto sulla porta:",
          PORT
        );
      });
  })
  .catch((error) => {
    console.log(error);
  });
