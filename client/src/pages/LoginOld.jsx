import {
  Form,
  FormGroup,
  Label,
  Input,
  Button,
  Spinner,
  Alert,
} from "reactstrap";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import config from "../config.json";

function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [loading, setLoading] = useState(false);
  const [alertType, setAlertType] = useState("");
  const [alert, setAlert] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  function handleSubmit(e) {
    e.preventDefault();
    if (!username || !password) {
      setAlertType("danger");
      setAlert("I campi devono essere tutti compilati!");
      return;
    }
    setLoading(true);
    let userLogin = { username, password };

    async function postLogin(userLogin) {
      const response = await fetch(config.apiUri + "/auth/login", {
        method: "POST",
        body: JSON.stringify(userLogin),
        headers: { "Content-Type": "application/json" },
        credentials: "include",
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
        setUsername("");
        setPassword("");
      }
    }

    postLogin(userLogin);
  }

  return (
    <div className="m-auto pt-5" style={{ minWidth: "350px", maxWidth: "30%" }}>
      <Form noValidate onSubmit={handleSubmit}>
        <FormGroup floating>
          <Input
            id="username"
            name="username"
            placeholder="Username"
            type="text"
            onChange={(e) => setUsername(e.target.value)}
            value={username}
          />
          <Label for="name">Username</Label>
        </FormGroup>
        <FormGroup floating>
          <Input
            id="password"
            name="password"
            placeholder="Password"
            type="password"
            onChange={(e) => setPassword(e.target.value)}
            value={password}
          />
          <Label for="password">Password</Label>
        </FormGroup>

        {loading ? (
          <Button disabled>
            <Spinner size="sm">Loading...</Spinner>
            <span> Login in corso</span>
          </Button>
        ) : (
          <Button type="submit">Login</Button>
        )}
        {alert && <Alert color={alertType}>{alert}</Alert>}
      </Form>
    </div>
  );
}

export default Login;
