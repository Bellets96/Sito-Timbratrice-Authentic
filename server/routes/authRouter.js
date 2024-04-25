import express from "express";
import "dotenv/config";

import {
  discordAuth,
  postRegistrati,
  getLogout,
} from "../controllers/authController.js";

//Router
const router = express.Router();

//Routes
router.post("/discord", discordAuth);

router.post("/registrati", postRegistrati);

router.get("/logout", getLogout);

export default router;
