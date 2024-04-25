import fetch from "node-fetch";
import "dotenv/config";

// Funzione per ottenere i dati dell'utente
export default async function getUserData(tokenData) {
  const userDataResponse = await fetch("https://discord.com/api/users/@me", {
    headers: {
      authorization: `${tokenData.token_type} ${tokenData.access_token}`,
    },
  });
  return userDataResponse.json();
}
