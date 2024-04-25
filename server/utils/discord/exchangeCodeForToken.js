import fetch from "node-fetch";
import "dotenv/config";

// Funzione per scambiare il codice con un token
export default async function exchangeCodeForToken(code) {
  const response = await fetch("https://discord.com/api/oauth2/token", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      client_id: process.env.CLIENT_ID,
      client_secret: process.env.CLIENT_SECRET,
      code: code,
      grant_type: "authorization_code",
      redirect_uri: process.env.REDIRECT_URI,
      scope: "identify",
    }),
  });
  return response.json();
}
