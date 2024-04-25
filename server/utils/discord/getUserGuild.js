import fetch from "node-fetch";
import "dotenv/config";

// Funzione per ottenere i ruoli dell'utente nel server Discord
export default async function getUserGuild(tokenData) {
  const userGuildResponse = await fetch(
    `https://discord.com/api/users/@me/guilds/${process.env.GUILD_ID}/member`,
    {
      headers: {
        authorization: `${tokenData.token_type} ${tokenData.access_token}`,
      },
    }
  );
  return userGuildResponse.json();
}
