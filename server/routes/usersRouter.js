import express from "express";
import "dotenv/config";

import { getUsers, postUser } from "../controllers/usersController.js";
import checkAuth from "../middleware/checkAuth.js";

//Router
const router = express.Router();

//Routes

router.get("/", checkAuth, getUsers);

router.post("/", checkAuth, postUser);

export default router;
