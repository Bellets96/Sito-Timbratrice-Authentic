import { Timbratrice, TotaliSettimanali } from "../models/timbratriceModel.js";
import { User } from "../models/userModel.js";

import getFasciaOraria from "../utils/getFasciaOraria.js";
import getCurrentWeekNumber from "../utils/getCurrentWeekNumber.js";
import convertiDataInUnix from "../utils/convertiDataInUnix.js";
import getTotaleTimbratureUtente from "../utils/getTotaleTimbratureUtente.js";

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
  let durataUnix = uscitaUnix - entrataUnix;

  try {
    const oldTimbratura = await Timbratrice.find({ _id: data._id });
    const timbratura = oldTimbratura[0];

    const modifiedTimbratura = await Timbratrice.findOneAndUpdate(
      { _id: data._id },
      {
        entrata: entrataUnix,
        uscita: uscitaUnix,
        durata: durataUnix,
      },
      { new: true }
    );
    // Trova e aggiorna i totali settimanali
    const totaliSettimanali = await TotaliSettimanali.findOne({
      discordId: timbratura.discordId,
      week: timbratura.week,
    });

    if (totaliSettimanali) {
      // Sottrai i valori della timbratura vecchia dai totali settimanali e aggiungi quelli della timbratura modificata
      totaliSettimanali.totaleDurata -= timbratura.durata;
      totaliSettimanali.totaleDurata += durataUnix;
      totaliSettimanali.bonus -=
        (timbratura.durata * timbratura.moltiplicatoreBonus) / 15000;
      totaliSettimanali.bonus +=
        (durataUnix * timbratura.moltiplicatoreBonus) / 15000;

      // Salva il documento aggiornato dei totali settimanali
      await totaliSettimanali.save();
    } else {
      await TotaliSettimanali.create({
        discordId: timbratura.discordId,
        week: timbratura.week,
        totaleDurata: durataUnix,
        bonus: (durataUnix * timbratura.moltiplicatoreBonus) / 15000,
      });
    }

    res.status(200).json(modifiedTimbratura);
  } catch (error) {
    res.status(500).json({ errorMsg: "Errore interno del server" });
  }
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
    //Trova ed elimina la timbratura
    const deletedTimbratura = await Timbratrice.findOneAndDelete({ _id: id });

    // Trova e aggiorna i totali settimanali
    const totaliSettimanali = await TotaliSettimanali.findOne({
      discordId: deletedTimbratura.discordId,
      week: deletedTimbratura.week,
    });

    if (totaliSettimanali) {
      // Sottrai i valori della timbratura eliminata dai totali settimanali
      totaliSettimanali.totaleDurata -= deletedTimbratura.durata;
      totaliSettimanali.bonus -=
        (deletedTimbratura.durata * deletedTimbratura.moltiplicatoreBonus) /
        15000;

      // Salva il documento aggiornato dei totali settimanali
      await totaliSettimanali.save();
    }

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

export async function addTimbratura(req, res) {
  const { user, entrataValue, uscitaValue } = req.body;
  const maxTurno = 6 * 60 * 60 * 1000; //6 ore
  const time = new Date(entrataValue).getTime();

  try {
    const userData = await User.find({ discordId: user.discordId });

    const userRole = userData[0].role;

    let moltiplicatoreBonus = 3;
    let fascia = getFasciaOraria(new Date(entrataValue).getHours());
    let entrata = convertiDataInUnix(entrataValue);
    let uscita = convertiDataInUnix(uscitaValue);

    //Controlla se presente una timbratura con la stessa fascia oraria
    let timbraturaInFascia = await Timbratrice.findOne({
      discordId: user.discordId,
      fascia,
    }).sort({ createdAt: -1 });

    //Se vi è una timbratura con la stessa fascia oraria controlla se quella timbratura è dello stesso giorno
    if (timbraturaInFascia) {
      if (
        (timbraturaInFascia.entrata != 0 &&
          timbraturaInFascia.entrata >= time - maxTurno * 2) ||
        (timbraturaInFascia.uscita != 0 &&
          timbraturaInFascia.uscita >= time - maxTurno * 2)
      ) {
        //Se è dello stesso giorno riduce il moltiplicatore sennò rimane invariato
        if (timbraturaInFascia.moltiplicatoreBonus > 1) {
          moltiplicatoreBonus = timbraturaInFascia.moltiplicatoreBonus - 1;
        } else {
          moltiplicatoreBonus = timbraturaInFascia.moltiplicatoreBonus;
        }
      }
    }

    let newTimbratura = {
      discordId: user.discordId,
      role: userRole,
      entrata: entrata,
      uscita: uscita,
      durata: uscita - entrata,
      fascia: fascia,
      moltiplicatoreBonus: moltiplicatoreBonus,
      week: getCurrentWeekNumber(new Date()),
    };

    const timbratura = await Timbratrice.create(newTimbratura);

    getTotaleTimbratureUtente(timbratura);

    return res
      .status(200)
      .json({ type: "success", msg: "Timbratura inserita con successo!" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      type: "danger",
      msg: "Errore durante la creazione della timbratura",
    });
  }
}
