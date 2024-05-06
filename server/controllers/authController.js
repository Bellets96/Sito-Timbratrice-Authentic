import "dotenv/config";

import exchangeCodeForToken from "../utils/discord/exchangeCodeForToken.js";
import getUserData from "../utils/discord/getUserData.js";
import getUserGuild from "../utils/discord/getUserGuild.js";
import handleLogin from "../utils/discord/handleLogin.js";

const allowedRoles = [
  process.env.VVF_ROLE_ID,
  process.env.ASL_ROLE_ID,
  process.env.PDS_ROLE_ID,
  process.env.CC_ROLE_ID,
  process.env.GDF_ROLE_ID,
  process.env.ACI_ROLE_ID,
  process.env.GLADIO_ROLE_ID,
];

// Funzione per l'autenticazione Discord
export async function discordAuth(req, res) {
  try {
    const { code } = req.body;
    if (!code) {
      console.log("no code");
      return res
        .status(401)
        .json({ type: "danger", msg: "Non sei autenticato!" });
    }

    const tokenData = await exchangeCodeForToken(code);

    const userGuild = await getUserGuild(tokenData);

    let userRole;

    //Controllo che l'utente abbia i ruoli nel server discord di authentic per proseguire con il login

    if (userGuild.roles) {
      const userAllowedRoles = userGuild.roles.filter((roleId) =>
        allowedRoles.includes(roleId)
      );

      if (!userAllowedRoles) {
        return res.status(401).json({
          type: "danger",
          msg: "Non risulti essere membro di alcuna fazione abilitata a questa timbratrice!",
        });
      }

      userRole = userAllowedRoles;
    }
    const userData = await getUserData(tokenData);

    if (!userRole) return;

    // Gestione del login
    const loginResult = await handleLogin(userData, userRole[0]);

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
