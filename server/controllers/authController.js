import jwt from "jsonwebtoken";

import "dotenv/config";

import { User } from "../models/userModel.js";

import exchangeCodeForToken from "../utils/discord/exchangeCodeForToken.js";
import getUserData from "../utils/discord/getUserData.js";
import getUserGuild from "../utils/discord/getUserGuild.js";
import handleLogin from "../utils/discord/handleLogin.js";

// Funzione per l'autenticazione Discord
export async function discordAuth(req, res) {
  try {
    const { code } = req.body;

    if (!code) {
      return res
        .status(401)
        .json({ type: "danger", msg: "Non sei autenticato!" });
    }

    const tokenData = await exchangeCodeForToken(code);

    const userGuild = await getUserGuild(tokenData);

    if (userGuild.roles) {
      if (!userGuild.roles.includes(process.env.DISCORD_ROLE_ID)) {
        return res.status(401).json({
          type: "danger",
          msg: "Non risulti essere un membro " + process.enc.CORPO + "!",
        });
      }
    }

    const userData = await getUserData(tokenData);
    // Gestione del login
    const loginResult = await handleLogin(userGuild, userData);

    if (loginResult) {
      let token = loginResult.data.token;
      return res
        .cookie("tokenJWT", token, {
          maxAge: 60 * 60 * 1000,
          httpOnly: true,
          secure: false,
        })
        .status(loginResult.status)
        .json(loginResult.data.userData);
    }
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ type: "danger", msg: "Errore interno al server" });
  }
}

export async function postRegistrati(req, res) {
  const { discordId, username, usernameic } = req.body;

  //Controllo dati del form
  if (!usernameic) {
    return res.status(400).json({
      type: "danger",
      msg: "Il campo del nome non può essere vuoto!",
    });
  }

  const newUser = {
    discordId,
    username,
    usernameic,
    isAdmin: false,
  };

  //Inserimento utente nel DB
  try {
    const user = await User.create(newUser);

    const payload = {
      sub: discordId.toString(),
      isAdmin: false,
    };

    return res.status(200).json({
      type: "success",
      msg: "Registrazione effettuata con successo! Verrai renindirizzato alla homepage",
      user,
      payload,
    });
  } catch (error) {
    return res.status(400).json({
      type: "danger",
      msg: "Errore durante la registrazione. Riprova.",
    });
  }
}

export async function getLogout(req, res) {
  const cookieSetting = {
    exprires: new Date(0),
    httpOnly: true,
    secure: false,
  };
  res.cookie("tokenJWT", "", cookieSetting).json({ msg: "Logout effettuato" });
}
