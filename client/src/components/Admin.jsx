import { useEffect, useState } from "react";
import { FormGroup, Input, Label, Alert, Button, Form } from "reactstrap";
import { useAuth } from "../context/AuthContext";

import getMinDate from "../js/getMinDate.js";

import config from "../config.json";

function Admin() {
  const { user } = useAuth();
  const [users, setUsers] = useState([]);
  const [selectUser, setSelectUser] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [usernameic, setUsernameic] = useState("");
  const [alertType, setAlertType] = useState("");
  const [alert, setAlert] = useState("");

  const findUserById = (userId) => users.find((u) => u.discordId === userId);

  async function handleAddTimbratura(e, user) {
    e.preventDefault();

    const entrataValue = e.target.form.entrata.value;
    const uscitaValue = e.target.form.uscita.value;
    const userData = { user, entrataValue, uscitaValue };

    if (!entrataValue || !uscitaValue) {
      setAlert("Le date devono essere entrambe inserite!");
      setAlertType("danger");
      setTimeout(() => {
        setAlert("");
        setAlertType("");
      }, 2000);
      return;
    }

    if (uscitaValue < entrataValue) {
      setAlert("L'uscita non può essere antecedente all'entrata!");
      setAlertType("danger");
      setTimeout(() => {
        setAlert("");
        setAlertType("");
      }, 2000);
      return;
    }

    try {
      const response = await fetch(config.apiUri + "/timbratrice/add", {
        method: "POST",
        body: JSON.stringify(userData),
        headers: { "Content-Type": "application/json" },
      });

      const data = await response.json();
      setAlert(data.msg);
      setAlertType(data.type);
      setTimeout(() => {
        setAlert("");
        setAlertType("");
      }, 2000);
    } catch (error) {
      console.error(error);
    }
  }

  async function handleDeleteUser(e, userToDelete) {
    e.preventDefault();

    try {
      const response = await fetch(config.apiUri + "/users/delete", {
        method: "DELETE",
        body: JSON.stringify(userToDelete),
        headers: { "Content-Type": "application/json" },
      });

      const data = await response.json();

      if (response.ok) {
        setUsers(
          users.filter((user) => user.discordId !== userToDelete.discordId)
        );
      }

      setAlert(data.msg);
      setAlertType(data.type);
      setTimeout(() => {
        setAlert("");
        setAlertType("");
      }, 2000);
    } catch (error) {
      console.error(error);
    }
  }

  async function handleSetAdmin(e, user) {
    const isAdmin = e.target.checked;

    const userData = { user, isAdmin };

    try {
      const response = await fetch(config.apiUri + "/users/setAdmin", {
        method: "PUT",
        body: JSON.stringify(userData),
        headers: { "Content-Type": "application/json" },
      });

      const data = await response.json();

      if (response.ok) {
        setIsAdmin(data.userData.isAdmin);
        setAlert(data.msg);
        setAlertType(data.type);
        setTimeout(() => {
          setAlert("");
          setAlertType("");
        }, 2000);
      } else {
        setAlert(data.msg);
        setAlertType(data.type);
        setTimeout(() => {
          setAlert("");
          setAlertType("");
        }, 5000);
      }
    } catch (error) {
      console.error(error);
    }
  }

  async function handleChangeName(e, userToModify) {
    e.preventDefault();

    const modifiedUser = {
      ...userToModify,
      usernameic: e.target.usernameic.value,
    };

    try {
      const response = await fetch(config.apiUri + "/users/modify", {
        method: "PUT",
        body: JSON.stringify(modifiedUser),
        headers: { "Content-Type": "application/json" },
      });

      const data = await response.json();

      if (response.ok) {
        setUsers(
          users.map((user) =>
            user.discordId === modifiedUser.discordId ? modifiedUser : user
          )
        );

        setAlert(data.msg);
        setAlertType(data.type);
        setTimeout(() => {
          setAlert("");
          setAlertType("");
        }, 2000);
      } else {
        setAlert("Errore durante l'aggiornamento dello stato da Admin");
        setAlertType("danger");
      }
    } catch (error) {
      console.error(error);
    }
  }

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

    if (selectUser) {
      // Aggiorna il nome utente corrente quando viene selezionato un nuovo utente
      setUsernameic(selectUser.usernameic || selectUser.username);
    }
  }, [selectUser]);

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
      <h4 className="text-center">Pannello Admin</h4>
      <FormGroup>
        <Label
          style={{
            fontWeight: "bold",
            fontSize: "1.5rem",
            paddingBlock: "10px",
          }}
          for="selectUser"
        >
          Seleziona utente
        </Label>
        <Input
          id="selectUser"
          name="select"
          type="select"
          onChange={(e) => {
            const selectedUserId = e.target.value;
            const selectedUser = findUserById(selectedUserId);
            setSelectUser(selectedUser);
            setIsAdmin(selectedUser ? selectedUser.isAdmin : false);
          }}
        >
          <option value={null}></option>
          {userOptions}
        </Input>
      </FormGroup>

      {selectUser && (
        <>
          <Form
            name="timbratura"
            id="timbratura"
            className="d-flex align-items-center"
          >
            <FormGroup>
              <Label>Entrata</Label>
              <Input
                id="entrata"
                name="entrata"
                placeholder="Entrata"
                type="datetime-local"
                min={getMinDate()}
                max={new Date().toISOString().slice(0, 16)}
              />
            </FormGroup>
            <FormGroup className="mx-3">
              <Label>Uscita</Label>
              <Input
                id="uscita"
                name="uscita"
                placeholder="Uscita"
                type="datetime-local"
                min={getMinDate()}
                max={new Date().toISOString().slice(0, 16)}
              />
            </FormGroup>
            <FormGroup switch>
              <Input
                type="switch"
                role="switch"
                checked={isAdmin}
                onChange={(e) => {
                  confirm(
                    "Sei sicuro di voler cambiare lo stato di Admin di questo utente?"
                  ) && handleSetAdmin(e, selectUser);
                }}
              />
              <Label check>Utente Admin</Label>
            </FormGroup>
          </Form>
          <div className="my-3">
            <Button
              color="success"
              type="submit"
              form="timbratura"
              onClick={(e) => handleAddTimbratura(e, selectUser)}
            >
              Aggiungi timbratura
            </Button>

            <Button
              color="danger"
              className="mx-3"
              onClick={(e) =>
                confirm(
                  "Sei sicuro di voler eliminare questo utente? Verranno eliminate anche tutte le timbrature associate a questo utente. L'operazione non è reversibile!"
                ) && handleDeleteUser(e, selectUser)
              }
            >
              Elimina utente
            </Button>
          </div>
          <Form onSubmit={(e) => handleChangeName(e, selectUser)}>
            <FormGroup floating>
              <Input
                id="usernameic"
                name="usernameic"
                placeholder="Modifica nome utente"
                value={usernameic || selectUser.username}
                onChange={(e) => setUsernameic(e.target.value)}
                type="text"
              />
              <Label for="usernameic">Modifica nome utente</Label>
            </FormGroup>
            <Button type="submit" color="success">
              Salva nome utente
            </Button>
          </Form>
        </>
      )}
      {alert && (
        <Alert className="mt-3" color={alertType}>
          {alert}
        </Alert>
      )}
    </>
  );
}

export default Admin;
