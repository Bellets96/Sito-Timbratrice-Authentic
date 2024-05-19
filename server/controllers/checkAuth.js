import jwt from "jsonwebtoken";

export default function checkAuth(req, res) {
  const tokenJWT = req.cookies.tokenJWT;

  if (!tokenJWT)
    return res.status(401).json({
      type: "danger",
      msg: "Non risulti essere autenticato! Effettua il login.",
    });
  try {
    const payload = jwt.verify(tokenJWT, process.env.JWT_KEY);

    if (!payload.isAdmin) {
      return res.status(401).json({
        type: "danger",
        msg: "Attenzione! Questa pagina è visibile ai solo amministratori!",
      });
    }

    return res.status(200).json({ type: "success", msg: "ok", payload });
  } catch (error) {
    res.status(401).json({
      type: "danger",
      msg: "Errore durante la procedura di autenticazione",
    });
  }
}
