import { User } from "../models/userModel.js";
import { Timbratrice, TimbratriceTemp } from "../models/timbratriceModel.js";

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
    res.status(200).json({
      modifiedUser,
      type: "success",
      msg: "Modifiche effettuate con successo!",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ errorMsg: "Errore interno del server" });
  }
}

export async function deleteUser(req, res) {
  const userData = req.body;

  try {
    const user = await User.findOneAndDelete({ discordId: userData.discordId });
    await Timbratrice.deleteMany({ discordId: userData.discordId });
    await TimbratriceTemp.deleteMany({ discordId: userData.discordId });

    const username = user.usernameic ? user.usernameic : user.username;

    res.status(200).json({
      type: "success",
      msg: `Utente ${username} eliminato con successo!`,
      user,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ type: "danger", msg: "Errore interno del server" });
  }
}

export async function setAdmin(req, res) {
  const { user, isAdmin } = req.body;

  try {
    const userData = await User.findOneAndUpdate(
      { discordId: user.discordId },
      {
        isAdmin: isAdmin,
      },
      { new: true }
    );

    res.status(200).json({
      type: "success",
      msg: "Stato Admin dell'utente corretamente modificato!",
      userData,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ type: "danger", msg: "Errore interno del server" });
  }
}
