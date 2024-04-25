import { User } from "../models/userModel.js";

export async function getUsers(req, res) {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ errorMsg: "Errore interno del server" });
  }
}

export async function postUser(req, res) {
  console.log(1);
  const discordId = req.body;
  console.log(req.body);
  /*   try {
    const user = await User.find({ discordId: discordId });
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ errorMsg: "Errore interno del server" });
  } */
}
