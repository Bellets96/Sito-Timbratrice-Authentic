import {
  Form,
  FormGroup,
  Label,
  Input,
  Button,
  Spinner,
  Alert,
} from "reactstrap";
import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import config from "../config.json";

function Login() {
  const location = useLocation();
  const navigate = useNavigate();
  const { login } = useAuth();
  const [loading, setLoading] = useState(false);
  const [alertType, setAlertType] = useState("");
  const [alert, setAlert] = useState("");

  function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    let discordId = e.target.discordId.value;
    let username = e.target.username.value;
    let usernameic = e.target.usernameic.value;
    let newUser = { discordId, username, usernameic };

    async function postRegistrazione(newUser) {
      const response = await fetch(config.apiUri + "/auth/registrati", {
        method: "POST",
        body: JSON.stringify(newUser),
        headers: { "Content-Type": "application/json" },
      });
      const data = await response.json();
      setAlertType(data.type);
      setAlert(data.msg);
      if (response.ok) {
        login(data.payload);
        setTimeout(() => {
          navigate("/");
        }, 2000);
      } else {
        setLoading(false);
      }
    }

    postRegistrazione(newUser);
  }

  if (location.state == null) {
    return (
      <>
        <Alert color="danger">
          Attenzione! Le registrazioni sono attualmente disponibili solo per
          chia appartiene a {config.corpo}!
        </Alert>
        <div className="d-flex gap-5 justify-content-start mx-3">
          <Button href={config.discordUri}>Entra con Discord</Button>
        </div>
      </>
    );
  } else {
    if (location.state.userData) {
      let userData = location.state.userData;
      return (
        <Form
          noValidate
          onSubmit={handleSubmit}
          className="m-auto pt-5"
          style={{ minWidth: "350px", maxWidth: "30%" }}
        >
          <FormGroup floating>
            <Input
              id="discordId"
              name="discordId"
              placeholder="Discord Id"
              type="text"
              defaultValue={userData.id}
              disabled
            />
            <Label for="discordId">Discord Id</Label>
          </FormGroup>
          <FormGroup floating>
            <Input
              id="username"
              name="username"
              placeholder="Username"
              type="text"
              defaultValue={userData.username}
              disabled
            />
            <Label for="name">Username</Label>
          </FormGroup>
          <FormGroup floating>
            <Input
              id="usernameic"
              name="usernameic"
              placeholder="Nome e Cognome IC"
              type="text"
              defaultValue={userData.userNameIc}
            />
            <Label for="name">Nome e Cognome IC</Label>
          </FormGroup>

          {loading ? (
            <Button disabled>
              <Spinner size="sm">Loading...</Spinner>
              <span> Invio in corso</span>
            </Button>
          ) : (
            <Button>Invia</Button>
          )}
          {alert && <Alert color={alertType}>{alert}</Alert>}
        </Form>
      );
    } else {
      return <h1>Errore durante la registrazione. Riprova.</h1>;
    }
  }
}

export default Login;
