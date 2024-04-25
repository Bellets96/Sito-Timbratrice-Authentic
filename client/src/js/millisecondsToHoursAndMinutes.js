export default function millisecondsToHoursAndMinutes(milliseconds) {
  // Converti i millisecondi in secondi
  const seconds = Math.floor(milliseconds / 1000);

  // Calcola il numero di ore
  const hours = Math.floor(seconds / 3600);

  // Calcola il numero di minuti rimanenti
  const minutes = Math.floor((seconds % 3600) / 60);

  // Formatta l'output come HH:MM
  const formattedHours = String(hours).padStart(2, "0");
  const formattedMinutes = String(minutes).padStart(2, "0");
  return `${formattedHours}:${formattedMinutes}`;
}
