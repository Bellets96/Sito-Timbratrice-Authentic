import https from "https";
import fs from "fs";
import express from "express";
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
  origin: true,
  credentials: true,
};

//Express App
const app = express();

//Middleware
app.use(express.json());
app.use(cors(corsOptions));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

//Routes
app.use("/api/auth", authRouter);
app.use("/api/users", usersRouter);
app.use("/api/timbratrice", timbratriceRouter);

app.get("/api/test", (req, res) => {
  res.send("test");
});

//Scheduled
cron.schedule("0 4 * * 2", () => {
  // Esegue ogni martedì alle 04:00
  getAllTimbrature();
});

const certificate = fs.readFileSync(process.env.SSL_CERT);
const privateKey = fs.readFileSync(process.env.SSL_KEY);

//DB Connection
mongoose
  .connect(MONGODB)
  .then(() => {
    // Avvia il server HTTPS
    https
      .createServer(
        {
          key: privateKey,
          cert: certificate,
        },
        app
      )
      .listen(PORT, () => {
        console.log(
          "Connessione a MongoDB avvenuta e server attivo in ascolto sulla porta:",
          PORT
        );
      });
  })
  .catch((error) => {
    console.log(error);
  });
