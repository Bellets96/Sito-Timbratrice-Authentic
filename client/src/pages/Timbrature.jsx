import { Row, Col, FormGroup, Label, Input, Alert, Table } from "reactstrap";
import { useEffect, useState } from "react";
import config from "../config.json";
import GetTimbrature from "../components/GetTimbrature";
import { useAuth } from "../context/AuthContext";
import GetSettimanali from "../components/GetSettimanali";

function Timbrature() {
  const { user } = useAuth();
  const [users, setUsers] = useState([]);
  const [selectUser, setSelectUser] = useState(null);
  const [selectWeek, setSelectWeek] = useState(null);
  const [alertType, setAlertType] = useState("");
  const [alert, setAlert] = useState("");

  useEffect(() => {
    async function getUsers() {
      const response = await fetch(config.apiUri + "/users", {
        method: "GET",
        credentials: "include",
      });
      const data = await response.json();

      if (response.ok) {
        setUsers(data);
      } else {
        setAlertType(data.type);
        setAlert(data.msg);
      }
    }

    getUsers();
  }, []);

  const getRecentWeeks = () => {
    const today = new Date();
    const weeks = [];
    const millisecondsInWeek = 7 * 24 * 60 * 60 * 1000;

    // Aggiungi la settimana corrente e le 6 settimane precedenti
    for (let i = 0; i < 7; i++) {
      const weekStart = new Date(today.getTime() - i * millisecondsInWeek);
      const weekNumber = getWeekNumber(weekStart);
      weeks.push({ week: weekNumber, label: `Settimana ${weekNumber}` });
    }

    return weeks;
  };

  const getWeekNumber = (date) => {
    const firstDayOfYear = new Date(date.getFullYear(), 0, 1);
    const pastDaysOfYear = (date - firstDayOfYear) / 86400000;
    return Math.ceil((pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7);
  };

  const weekOptions = getRecentWeeks().map((week) => (
    <option key={week.week} value={week.week}>
      {week.label}
    </option>
  ));

  if (!users) return;

  const usersWithSameRole =
    //Se l'utente che effettua la richiesta è Bellets (Dev) allora mostra tutti gli utenti, sennò solo quelli con lo stesso ruolo dell'utente
    user.discordId === config.idBellets
      ? users
      : users.filter((singleUser) => {
          // Assicurati che entrambi, user.role e singleUser.role, siano array
          const userRoles = Array.isArray(user.role) ? user.role : [user.role];
          const singleUserRoles = Array.isArray(singleUser.role)
            ? singleUser.role
            : [singleUser.role];

          // Controlla se ci sia almeno una corrispondenza tra gli array
          return singleUserRoles.some((role) => userRoles.includes(role));
        });

  const userOptions = usersWithSameRole.map((singleUser) => (
    <option key={singleUser._id} value={singleUser.discordId}>
      {singleUser.usernameic || singleUser.username}
    </option>
  ));

  return (
    <>
      {user && user.isAdmin ? (
        <>
          <Row style={{ margin: "0", padding: "10px" }}>
            <Col xs="6">
              <FormGroup>
                <Label
                  style={{
                    fontWeight: "bold",
                    fontSize: "1.5rem",
                    paddingBlock: "10px",
                  }}
                  for="selectUser"
                >
                  Seleziona operatore
                </Label>
                <Input
                  id="selectUser"
                  name="select"
                  type="select"
                  onChange={(e) => {
                    setSelectUser(e.target.value);
                  }}
                >
                  <option value={null}></option>
                  {userOptions}
                </Input>
              </FormGroup>

              <GetTimbrature discordId={selectUser}></GetTimbrature>
            </Col>
            <Col xs="6">
              <FormGroup>
                <Label
                  style={{
                    fontWeight: "bold",
                    fontSize: "1.5rem",
                    paddingBlock: "10px",
                  }}
                  for="selectWeek"
                >
                  Seleziona settimana
                </Label>
                <Input
                  id="selectWeek"
                  name="select"
                  type="select"
                  onChange={(e) => {
                    setSelectWeek(e.target.value);
                  }}
                >
                  <option value="null"></option>
                  {weekOptions}
                </Input>
              </FormGroup>
              <div>
                <Table bordered hover responsive striped>
                  <thead>
                    <tr>
                      <th style={{ width: "50%" }}>Nome e Cognome</th>
                      <th style={{ width: "25%" }}>Timbrature totali</th>
                      <th style={{ width: "25%" }}>Premio settimanale</th>
                    </tr>
                  </thead>
                  <tbody>
                    <GetSettimanali
                      week={selectWeek}
                      users={usersWithSameRole}
                    ></GetSettimanali>
                  </tbody>
                </Table>
              </div>
            </Col>
          </Row>
        </>
      ) : (
        <Alert color={alertType}> {alert} </Alert>
      )}
    </>
  );
}

export default Timbrature;
