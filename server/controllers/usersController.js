import { User } from "../models/userModel.js";

export async function getUsers(req, res) {
  try {
    const users = await User.find().sort({ usernameic: 1 });
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ errorMsg: "Errore interno del server" });
  }
}
