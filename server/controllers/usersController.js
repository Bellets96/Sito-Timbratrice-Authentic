import { User } from "../models/userModel.js";

export async function getUsers(req, res) {
  try {
    const users = await User.find().sort({ usernameic: 1 });
    res.status(200).json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ errorMsg: "Errore interno del server" });
  }
}

export async function modifyUser(req, res) {
  try {
    const user = req.body;
    const modifiedUser = await User.findOneAndUpdate(
      { discordId: user.discordId },
      { usernameic: user.usernameic },
      { new: true }
    );
    res
      .status(200)
      .json({
        modifiedUser,
        type: "success",
        msg: "Modifiche effettuate con successo!",
      });
  } catch (error) {
    console.error(error);
    res.status(500).json({ errorMsg: "Errore interno del server" });
  }
}
