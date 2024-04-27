import { useEffect, useState } from "react";
import { Table, Button, Input } from "reactstrap";
import config from "../config.json";

import dataConverterToIso from "../js/dataConverterToIso.js";
import dataUnixToLocal from "../js/dataUnixToLocal.js";
import millisecondsToHoursAndMinutes from "../js/millisecondsToHoursAndMinutes.js";

function GetTimbrature(discordId) {
  const [timbrature, setTimbrature] = useState(null);
  const [modify, setModify] = useState(false);
  const [key, setKey] = useState(null);

  function toggleModify(_id) {
    if (key === _id && modify) {
      setModify(false); // Chiudi la modalità modifica se già aperta sulla stessa riga
      setKey(null);
    } else {
      setModify(true); // Apri la modalità modifica
      setKey(_id);
    }
  }

  async function handleModify(_id) {
    // Recupera i valori degli input
    const entrataValue = document.querySelector(`#entrata-${_id}`).value;
    const uscitaValue = document.querySelector(`#uscita-${_id}`).value;
    // Crea un oggetto con i dati da inviare al backend
    const data = {
      _id: _id,
      entrata: entrataValue,
      uscita: uscitaValue,
    };

    try {
      const response = await fetch(config.apiUri + "/timbratrice/modify", {
        method: "PUT",
        body: JSON.stringify(data),
        headers: { "Content-Type": "application/json" },
      });

      if (!response.ok) {
        throw new Error("Errore durante la richiesta al server");
      }

      const responseData = await response.json();

      // Aggiorna lo stato con le nuove date
      const updatedTimbrature = timbrature.map((timbratura) => {
        if (timbratura._id === _id) {
          return {
            ...timbratura,
            entrata: responseData.entrata,
            uscita: responseData.uscita,
            durata: responseData.uscita - responseData.entrata,
          };
        }
        return timbratura;
      });
      setTimbrature(updatedTimbrature);
    } catch (error) {
      console.error("Errore durante la richiesta:", error);
    }

    toggleModify(_id);
  }

  async function handleDelete(_id) {
    console.log(_id);
  }

  useEffect(() => {
    async function getTimbrature() {
      try {
        const response = await fetch(config.apiUri + "/timbratrice/get", {
          method: "POST",
          body: JSON.stringify(discordId),
          headers: { "Content-Type": "application/json" },
        });
        const data = await response.json();
        setTimbrature(data.reverse());
      } catch (error) {
        console.error("Errore nel recupero delle timbrature:", error);
      }
    }

    getTimbrature();
  }, [discordId]);

  if (!timbrature) {
    return;
  }

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

  const timbratureUtente = timbrature.map(
    ({ _id, entrata, uscita, durata }) => (
      <tr key={_id}>
        {modify && key === _id ? (
          <>
            <td>
              <Input
                id={"entrata-" + _id}
                name="entrata"
                placeholder="Entrata"
                type="datetime-local"
                min={minDate}
                max={new Date().toISOString().slice(0, 16)}
                defaultValue={dataConverterToIso(entrata)}
              />
            </td>
            <td>
              <Input
                id={"uscita-" + _id}
                name="uscita"
                placeholder="Uscita"
                type="datetime-local"
                min={minDate}
                max={new Date().toISOString().slice(0, 16)}
                defaultValue={dataConverterToIso(uscita)}
              />
            </td>
            <td>{millisecondsToHoursAndMinutes(durata)}</td>
            <td>
              <Button form="entrata" onClick={() => handleModify(_id)}>
                <i className="bi bi-check-square"></i>
              </Button>
              <Button type="submit" onClick={() => handleDelete(_id)}>
                <i className="bi bi-trash"></i>
              </Button>
              <Button onClick={() => toggleModify(_id)}>
                <i className="bi bi-x-square"></i>
              </Button>
            </td>
          </>
        ) : (
          <>
            <td>{dataUnixToLocal(entrata)}</td>
            <td>{dataUnixToLocal(uscita)}</td>
            <td>{millisecondsToHoursAndMinutes(durata)}</td>
            <td>
              <Button onClick={() => toggleModify(_id)}>
                <i className="bi bi-pencil-square"></i> Modifica
              </Button>
            </td>
          </>
        )}
      </tr>
    )
  );

  return (
    <div>
      <Table bordered hover responsive striped>
        <thead>
          <tr>
            <th style={{ width: "30%" }}>Ingressi</th>
            <th style={{ width: "30%" }}>Uscite</th>
            <th style={{ width: "15%" }}>Durata</th>
            <th style={{ width: "20%" }}>Modifica</th>
          </tr>
        </thead>
        <tbody>{timbratureUtente}</tbody>
      </Table>
    </div>
  );
}

export default GetTimbrature;