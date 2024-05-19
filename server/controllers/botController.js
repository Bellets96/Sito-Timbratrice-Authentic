import { Timbratrice, TimbratriceTemp } from "../models/timbratriceModel.js";

import getFasciaOraria from "../utils/getFasciaOraria.js";
import getCurrentWeekNumber from "../utils/getCurrentWeekNumber.js";
import getTotaleTimbratureUtente from "../utils/getTotaleTimbratureUtente.js";

export async function setTimbraturaBot(req, res) {
  const data = req.body;
  const maxTurno = 6 * 60 * 60 * 1000; //6 ore

  //Se presenti i dati prosegue, sennò da errore
  if (data) {
    //Dichiara i dati necessari alla timbratura
    let discordId = data.userId;
    let type = data.type;
    let role = data.role;
    let time = new Date().getTime();
    let fascia = getFasciaOraria(new Date().getHours());
    let moltiplicatoreBonus = 3;
    let week = getCurrentWeekNumber(new Date());

    //Crea oggetto per una nuova timbratura temporanea
    let newTimbraturaTemp = {
      discordId,
      role,
      type,
      time,
      fascia,
      moltiplicatoreBonus,
      week,
    };

    //Crea oggetto per una nuova timbratura senza ingresso
    let noEntry = {
      discordId,
      role,
      entrata: 0,
      uscita: newTimbraturaTemp.time,
      durata: 0,
      fascia,
      moltiplicatoreBonus,
      week,
    };

    //Crea oggetto per una nuova timbratura senza uscita
    let noExit = {
      discordId,
      role,
      entrata: newTimbraturaTemp.time,
      uscita: 0,
      durata: 0,
      fascia,
      moltiplicatoreBonus,
      week,
    };

    try {
      //Controlla se presente una timbratura in ingresso
      let oldEntrataTemp = await TimbratriceTemp.findOneAndDelete({
        discordId,
        type: "entrata",
      });

      //Controlla se presente una timbratura con la stessa fascia oraria
      let timbraturaInFascia = await Timbratrice.findOne({
        discordId,
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

      switch (true) {
        case !oldEntrataTemp && newTimbraturaTemp.type === "entrata": {
          await TimbratriceTemp.create(newTimbraturaTemp);

          return res.status(200).json("Timbratura in ingresso effettuata!");
        }

        case !oldEntrataTemp && newTimbraturaTemp.type === "uscita": {
          await Timbratrice.create(noEntry);

          return res
            .status(200)
            .json(
              "Attenzione! Non è stata timbrata l'ultima entrata. Avvisare un amministratore!"
            );
        }

        case oldEntrataTemp &&
          newTimbraturaTemp.type === "uscita" &&
          newTimbraturaTemp.time - oldEntrataTemp.time >= maxTurno: {
          await Timbratrice.create([noExit, noEntry]);

          return res
            .status(200)
            .json(
              "Attenzione! L'ultimo ingresso risale a più di 6 ore fa. Avvisare un amministratore!"
            );
        }

        case oldEntrataTemp && newTimbraturaTemp.type === "entrata": {
          await Timbratrice.create(noExit);

          await TimbratriceTemp.create(newTimbraturaTemp);

          return res
            .status(200)
            .json(
              "Attenzione! Non è stata timbrata l'ultima uscita. Avvisare un amministratore!"
            );
        }

        case oldEntrataTemp && newTimbraturaTemp.type === "uscita": {
          let newTimbraturaFull = {
            discordId,
            role,
            entrata: oldEntrataTemp.time,
            uscita: newTimbraturaTemp.time,
            durata: newTimbraturaTemp.time - oldEntrataTemp.time,
            fascia: oldEntrataTemp.fascia || newTimbraturaTemp.fascia,
            moltiplicatoreBonus,
            week,
          };

          const timbratura = await Timbratrice.create(newTimbraturaFull);

          getTotaleTimbratureUtente(timbratura);

          return res.status(200).json("Timbratura completa effettuata!");
        }

        default: {
          return res
            .status(500)
            .json(
              "Errore durante l'inserimento delle timbrature! Contatta un amministratore."
            );
        }
      }
    } catch (error) {
      res.status(500).json("Errore durante la richiesta al server");
    }
  } else {
    res.status(400).json("Errore durante la richiesta");
  }
}
