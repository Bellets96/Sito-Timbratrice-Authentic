import express from "express";
import "dotenv/config";

import {
  getTimbrature,
  modifyTimbrature,
  getSettimanali,
  deleteTimbratura,
} from "../controllers/timbratriceController.js";

import { setTimbraturaBot } from "../controllers/botController.js";

//Router
const router = express.Router();

//Routes
router.post("/", setTimbraturaBot);

router.post("/get", getTimbrature);

router.put("/modify", modifyTimbrature);

router.get("/settimanali", getSettimanali);

router.delete("/delete", deleteTimbratura);

export default router;
