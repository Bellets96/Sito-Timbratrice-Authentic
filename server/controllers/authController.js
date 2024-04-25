import "dotenv/config";

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
        .json(loginResult.data);
    }
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ type: "danger", msg: "Errore interno al server" });
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
