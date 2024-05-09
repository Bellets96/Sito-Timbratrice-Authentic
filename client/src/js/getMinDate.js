export default function getMinDate() {
  const today = new Date();
  const currentDayOfWeek = today.getDay();
  let monday;

  if (currentDayOfWeek === 1) {
    // Se oggi è lunedì, calcola il lunedì precedente
    monday = new Date(today);
    monday.setDate(today.getDate() - 7); // Sottrai una settimana
  } else {
    // Altrimenti, calcola la data del lunedì di questa settimana
    monday = new Date(today);
    monday.setDate(today.getDate() - currentDayOfWeek + 1);
  }
  const minDate = monday.toISOString().slice(0, 16);

  return minDate;
}
