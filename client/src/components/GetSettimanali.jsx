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
    const minHours = utente.totaleDurata >= 6 * 60 * 60 * 1000;
    const bonus = calculateBonus(utente.bonus, minHours);

    return {
      oreTotali,
      bonus,
      minHours,
    };
  }

  function calculateBonus(bonus, minHours) {
    if (!minHours) {
      return (bonus = 0);
    }

    if (bonus < 500) return 0;
    else if (bonus < 750) return 750;
    else if (bonus < 1000) return 1000;
    else if (bonus < 1250) return 1250;
    else if (bonus < 1500) return 1500;
    else if (bonus < 1750) return 1750;
    else if (bonus < 2000) return 2000;
    else if (bonus < 2250) return 2250;
    else if (bonus < 2500) return 2500;
    else if (bonus < 3000) return 3000;
    else if (bonus < 3500) return 3500;
    else if (bonus < 4000) return 4000;
    else if (bonus < 4500) return 4500;
    else if (bonus < 5000) return 5000;
    else if (bonus < 5500) return 5500;
    else if (bonus < 6000) return 6000;
    else if (bonus < 6500) return 6500;
    else if (bonus < 7000) return 7000;
    else if (bonus < 7500) return 7500;
    else if (bonus < 8000) return 8000;
    else if (bonus < 8500) return 8500;
    else if (bonus < 9000) return 9000;
    else if (bonus < 9500) return 9500;
    else if (bonus < 10000) return 10000;
    else if (bonus < 11000) return 11000;
    else if (bonus < 12000) return 12000;
    else if (bonus < 13000) return 13000;
    else if (bonus < 14000) return 14000;
    else if (bonus < 15000) return 15000;
    else if (bonus < 16000) return 16000;
    else if (bonus < 17000) return 17000;
    else if (bonus < 18000) return 18000;
    else if (bonus < 19000) return 19000;
    else if (bonus < 20000) return 20000;
    else if (bonus < 22500) return 22500;
    else if (bonus < 25000) return 25000;
    else if (bonus < 27500) return 27500;
    else if (bonus < 30000) return 30000;
    else return 30000;
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
