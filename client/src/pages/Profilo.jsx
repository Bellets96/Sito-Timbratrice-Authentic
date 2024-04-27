import { useAuth } from "../context/AuthContext";
import {
  Alert,
  Form,
  FormGroup,
  Label,
  Input,
  Button,
  Spinner,
} from "reactstrap";
import { useState } from "react";

import config from "../config.json";

function Profilo() {
  const { user, login } = useAuth();
  const [loading, setLoading] = useState(false);
  const [alertType, setAlertType] = useState("");
  const [alert, setAlert] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    let usernameic = e.target.usernameic.value;
    let modifiedUser = { ...user, usernameic };

    const response = await fetch(config.apiUri + "/users/modify", {
      method: "PUT",
      credentials: "include",
      body: JSON.stringify(modifiedUser),
      headers: { "Content-Type": "application/json" },
    });

    const data = await response.json();

    if (response.ok) {
      e.target.usernameic.value = "";
      setLoading(false);
      login(data.modifiedUser);
      setAlert(data.msg);
      setAlertType(data.type);
    }
  }

  return (
    <>
      {user ? (
        <>
          <h4 className="d-flex text-center m-3">
            Benvenuto {user.usernameic || user.username} nel pannello utente.
            Qui di seguito potrai modificare i dati relativi al tuo profilo.
          </h4>
          <Form
            className="m-5"
            style={{ minWidth: "300px", maxWidth: "30%" }}
            onSubmit={(e) => handleSubmit(e)}
          >
            <FormGroup floating>
              <Input
                id="usernameic"
                name="usernameic"
                placeholder="Nome e Cognome IC"
                type="text"
              />
              <Label for="usernameic">Nome e Cognome IC</Label>
            </FormGroup>
            {!loading ? (
              <>
                <Button type="submit" color="success">
                  Salva modifiche
                </Button>
                <Alert className="mt-3" color={alertType}>
                  {" "}
                  {alert}
                </Alert>
              </>
            ) : (
              <Button type="submit" disabled color="success">
                <Spinner size="sm">Loading...</Spinner>
                Modifiche in corso
              </Button>
            )}
          </Form>
        </>
      ) : (
        <div className="d-flex flex-column align-items-center mt-5">
          <Alert color="danger">
            Effettua il login prima di accedere a questa pagina!
          </Alert>
        </div>
      )}
    </>
  );
}

export default Profilo;
