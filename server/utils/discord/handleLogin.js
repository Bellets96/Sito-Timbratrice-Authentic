import jwt from "jsonwebtoken";

import { User } from "../../models/userModel.js";

import "dotenv/config";

// Funzione per gestire il login dell'utente
export default async function handleLogin(userGuild, userData) {
  const userNameIc = userGuild.nick;
  const discordId = userData.id;
  if (discordId) {
    try {
      const userExist = await User.findOne({ discordId: discordId });
      if (userExist) {
        const payload = {
          sub: userExist.discordId.toString(),
          isAdmin: userExist.isAdmin,
        };
        const token = jwt.sign(payload, process.env.JWT_KEY, {
          expiresIn: "1h",
        });

        return {
          status: 200,
          data: {
            payload,
            token,
            type: "success",
            msg: "Login effettuato con successo! Verrai reindirizzato alla homepage.",
          },
        };
      } else {
        userData.userNameIc = userNameIc;
        return { status: 200, data: { userData, token } };
      }
    } catch (error) {
      console.error(error);
      return { status: 500, data: { type: "danger", msg: "Errore DB" } };
    }
  }
}
