import { Timbratrice, TotaliSettimanali } from "../models/timbratriceModel.js";

import convertiDataInUnix from "../utils/convertiDataInUnix.js";

export async function getTimbrature(req, res) {
  const data = req.body;
  try {
    const timbrature = await Timbratrice.find({
      discordId: data.discordId,
    }).sort({ entrata: 1 });
    res.status(200).json(timbrature);
  } catch (error) {
    res.status(500).json({ errorMsg: "Errore interno del server" });
  }
}

export async function modifyTimbrature(req, res) {
  const data = req.body;
  let entrataUnix = convertiDataInUnix(data.entrata);
  let uscitaUnix = convertiDataInUnix(data.uscita);

  try {
    const timbratura = await Timbratrice.findOneAndUpdate(
      { _id: data._id },
      {
        entrata: entrataUnix,
        uscita: uscitaUnix,
        durata: uscitaUnix - entrataUnix,
      },
      {
        new: true,
      }
    );
    res.status(200).json(timbratura);
  } catch (error) {
    res.status(500).json({ errorMsg: "Errore interno del server" });
  }

  res.status(200);
}

export async function getSettimanali(req, res) {
  const { week } = req.query;
  try {
    const timbratureSettimanali = await TotaliSettimanali.find({ week: week });
    res.status(200).json(timbratureSettimanali);
  } catch (error) {
    res.status(500).json({ errorMsg: "Errore interno del server" });
  }
}

export async function deleteTimbratura(req, res) {
  const id = req.body;
  try {
    const deletedTimbratura = await Timbratrice.findOneAndDelete({ _id: id });
    const newTimbrature = await Timbratrice.find({
      discordId: deletedTimbratura.discordId,
    });
    res.status(200).json({
      type: "success",
      msg: "Timbratura eliminata con successo!",
      newTimbrature,
    });
  } catch (error) {
    res.status(500).json({
      type: "danger",
      msg: "Errore durante l'eliminazione della timbratura",
    });
  }
}
