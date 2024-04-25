import { Timbratrice, TotaliSettimanali } from "../models/timbratriceModel.js";
import getCurrentWeekNumber from "../utils/getCurrentWeekNumber.js";

export default async function getAllTimbrature() {
  try {
    // Ottieni il numero della settimana corrente meno uno
    const previousWeek = getCurrentWeekNumber() - 1;

    // Esegui l'aggregazione per ogni ID utente, filtrando per la settimana precedente
    let results = await Timbratrice.aggregate([
      {
        $match: { week: previousWeek }, // Filtra per la settimana precedente
      },
      {
        $group: {
          _id: "$discordId", // Raggruppa per ID utente
          timbrature: {
            $push: {
              durata: "$durata",
              moltiplicatoreBonus: "$moltiplicatoreBonus",
            },
          }, // Aggiungi tutte le timbrature per questo utente
        },
      },
      {
        $project: {
          _id: 0,
          discordId: "$_id",
          timbrature: {
            $reduce: {
              input: "$timbrature",
              initialValue: [],
              in: {
                $concatArrays: [
                  "$$value",
                  ["$$this.durata", "$$this.moltiplicatoreBonus"],
                ],
              },
            },
          },
        },
      },
    ]);
    // Applica le operazioni per calcolare il bonus
    results.forEach((result) => {
      const { discordId, timbrature } = result;
      let totaleDurata = 0;
      let risultatoOperazioni = 0;
      for (let i = 0; i < timbrature.length; i += 2) {
        const durata = timbrature[i];
        totaleDurata += durata;
        const moltiplicatoreBonus = timbrature[i + 1];
        risultatoOperazioni += durata * moltiplicatoreBonus;
      }

      let bonusSettimanale = {
        discordId: discordId,
        totaleDurata: totaleDurata,
        week: previousWeek,
        bonus: risultatoOperazioni / 5000,
      };

      try {
        TotaliSettimanali.create(bonusSettimanale);
      } catch (error) {
        console.error(error);
      }
    });
  } catch (error) {
    console.error(error);
  }
}
