import express from "express";
import "dotenv/config";

import {
  getUsers,
  modifyUser,
  deleteUser,
  setAdmin,
} from "../controllers/usersController.js";
import checkAuth from "../controllers/checkAuth.js";

//Router
const router = express.Router();

//Routes

router.get("/", getUsers);

router.put("/modify", modifyUser);

router.delete("/delete", deleteUser);

router.put("/setAdmin", setAdmin);

router.get("/checkAuth", checkAuth);

export default router;
