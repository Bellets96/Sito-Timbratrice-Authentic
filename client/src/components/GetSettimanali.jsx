/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
import config from "../config.json";
import { Alert } from "reactstrap";

import millisecondsToHoursAndMinutes from "../js/millisecondsToHoursAndMinutes.js";

function GetSettimanali({ week, users }) {
  const [settimanali, setSettimanali] = useState([{}]);
  const [alertType, setAlertType] = useState("");
  const [alert, setAlert] = useState("");

  useEffect(() => {
    async function getSettimanali() {
      if (week === null) return;
      try {
        const response = await fetch(
          config.apiUri + "/timbratrice/settimanali?week=" + week
        );

        const data = await response.json();
        if (response.ok) {
          setSettimanali(data.reverse());
        } else {
          setAlertType(data.type);
          setAlert(data.msg);
        }
      } catch (error) {
        console.error("Errore nel recupero delle timbrature:", error);
      }
    }

    getSettimanali();
  }, [week]);

  if (!settimanali) {
    return;
  }

  function getInfo(discordId) {
    const utente = settimanali.find((item) => item.discordId === discordId);

    if (!utente) {
      return {
        oreTotali: 0,
        bonus: 0,
        minHours: false,
      };
    }

    const oreTotali = millisecondsToHoursAndMinutes(utente.totaleDurata);
    const bonus = calculateBonus(utente.bonus);
    const minHours = utente.totaleDurata >= 6 * 60 * 60 * 1000;

    return {
      oreTotali,
      bonus,
      minHours,
    };
  }

  function calculateBonus(bonus) {
    if (bonus < 2500) return 0;
    else if (bonus < 5000) return 2500;
    else if (bonus < 7500) return 5000;
    else if (bonus < 10000) return 7500;
    else if (bonus < 12500) return 10000;
    else if (bonus < 15000) return 12500;
    else if (bonus < 17500) return 15000;
    else if (bonus < 20000) return 17500;
    else return 20000;
  }

  const userTable = users.map((user) => {
    const { oreTotali, bonus, minHours } = getInfo(user.discordId);
    const rowClassName = minHours ? "table-success" : "table-danger";

    return (
      <tr key={user._id} className={rowClassName}>
        <td>{user.usernameic}</td>
        <td>{oreTotali}</td>
        <td>{bonus}€</td>
      </tr>
    );
  });

  return (
    <>
      {userTable}

      <>{alert && <Alert color={alertType}>{alert}</Alert>}</>
    </>
  );
}

export default GetSettimanali;
