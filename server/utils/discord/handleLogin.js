import jwt from "jsonwebtoken";

import { User } from "../../models/userModel.js";

import "dotenv/config";

// Funzione per gestire il login dell'utente
export default async function handleLogin(userData, userRole) {
  const discordId = userData.id;
  const username = userData.username;
  const role = userRole;

  if (role.length === 0) {
    return {
      status: 400,
      data: { type: "danger", msg: "Non hai ruoli autorizzati!" },
    };
  }

  if (discordId) {
    try {
      const userExist = await User.findOne({ discordId: discordId });

      //Se l'utente è già registrato effettua il login
      if (userExist) {
        if (userExist.role != role) {
          await User.findOneAndUpdate({ discordId: discordId }, { role: role });
        }

        const payload = {
          discordId: userExist.discordId.toString(),
          username: username,
          usernameic: userExist.usernameic,
          role: role,
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
            msg: "Login effettuato con successo! Verrai reindirizzato alla pagina profilo.",
          },
        };
      } else {
        //Altrimenti crea il nuovo utente poi effettua il login
        let user = { discordId, role, username, isAdmin: false };
        const newUser = await User.create(user);

        const payload = {
          discordId: discordId.toString(),
          username: username,
          role: role,
          isAdmin: false,
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
      }
    } catch (error) {
      console.error(error);
      return { status: 500, data: { type: "danger", msg: "Errore DB" } };
    }
  }
}
