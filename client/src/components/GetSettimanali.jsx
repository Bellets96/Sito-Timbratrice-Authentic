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
      if (week === null || week === "null") {
        setSettimanali([]);
        return;
      }

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
  }, [week, users]);

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
      return 0;
    }
    console.log(bonus);
    let increment;

    if (bonus < 500) increment = 0;
    else if (bonus < 2500) increment = 250;
    else if (bonus < 10000) increment = 500;
    else if (bonus < 20000) increment = 1000;
    else if (bonus < 30000) increment = 2500;

    //Arrotonda il bonus in base all'incremento per poi moltiplicarlo per lo stesso
    const roundedBonus = Math.round(bonus / increment) * increment;

    return Math.min(roundedBonus, 30000);
  }

  let userTable = users.map((user) => {
    const { oreTotali, bonus, minHours } = getInfo(user.discordId);
    const rowClassName = minHours ? "table-success" : "table-danger";

    return (
      <tr key={user._id} className={rowClassName}>
        <td>{user.usernameic || user.username}</td>
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
