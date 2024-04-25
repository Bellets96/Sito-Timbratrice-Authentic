export default function dataConverterToIso(unixTime) {
  // Crea un oggetto Date utilizzando il valore Unix
  let data = new Date(unixTime);

  // Funzione per aggiungere uno zero davanti ai numeri minori di 10 (per mesi e giorni)
  function padTo2Digits(num) {
    return num.toString().padStart(2, "0");
  }

  // Convertiamo la data in formato ISO 8601
  let dataISO = `${data.getFullYear()}-${padTo2Digits(
    data.getMonth() + 1
  )}-${padTo2Digits(data.getDate())}T${padTo2Digits(
    data.getHours()
  )}:${padTo2Digits(data.getMinutes())}`;
  // Ora `dataISO` è nel formato richiesto da <input type="datetime-local">
  return dataISO;
}
