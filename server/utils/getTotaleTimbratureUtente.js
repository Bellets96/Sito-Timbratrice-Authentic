import { TotaliSettimanali } from "../models/timbratriceModel.js";

export default async function getTotaleTimbratureUtente(timbratura) {
  try {
    const { discordId, week, durata, moltiplicatoreBonus } = timbratura;

    // Cerca un documento per l'utente e la settimana corrente
    let TotaleSettimanale = await TotaliSettimanali.findOne({
      discordId,
      week,
    });

    if (TotaleSettimanale) {
      // Se esiste già un documento, aggiorna i totali settimanali con la nuova timbratura
      TotaleSettimanale.totaleDurata += durata;
      TotaleSettimanale.bonus += (durata * moltiplicatoreBonus) / 15000;
      TotaleSettimanale = await TotaleSettimanale.save();
    } else {
      // Se non esiste un documento, crea un nuovo documento per i totali settimanali
      TotaleSettimanale = await TotaliSettimanali.create({
        discordId,
        week,
        totaleDurata: durata,
        bonus: (durata * moltiplicatoreBonus) / 15000,
      });
    }

    // Ritorna i totali settimanali aggiornati o appena creati
    return TotaleSettimanale;
  } catch (error) {
    console.error(error);
  }
}
