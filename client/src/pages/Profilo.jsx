import { useAuth } from "../context/AuthContext";
import {
  Alert,
  Form,
  FormGroup,
  Label,
  Input,
  Button,
  Spinner,
  Row,
  Col,
} from "reactstrap";
import { useState } from "react";

import Admin from "../components/Admin";

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
          <Row className="mt-3" style={{ margin: "0", padding: "10px" }}>
            <Col className="mx-3" style={{ minWidth: "300px" }}>
              <h4 className="text-center mb-5">
                Benvenuto {user.usernameic || user.username} nel pannello
                utente. Qui di seguito potrai modificare i dati relativi al tuo
                profilo.
              </h4>
              <Form onSubmit={(e) => handleSubmit(e)}>
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
            </Col>
            <Col style={{ minWidth: "300px" }}>
              {user.isAdmin && <Admin></Admin>}
            </Col>
          </Row>
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
