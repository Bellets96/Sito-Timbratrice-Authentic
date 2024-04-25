import { Spinner, Alert } from "reactstrap";

import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import config from "../config.json";

function Logout() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [alertType, setAlertType] = useState("");
  const [alert, setAlert] = useState("");

  useEffect(() => {
    async function getLogout() {
      const response = await fetch(config.apiUri + "/auth/logout", {
        method: "GET",
        credentials: "include",
      });

      const data = await response.json();
      setAlertType(data.type);
      setAlert(data.msg);

      if (response.ok) {
        login(null);
        setTimeout(() => {
          navigate("/");
        }, 1000);
      }
    }

    getLogout();
  }, [login, navigate]);

  return (
    <>
      <Alert color="danger">
        <Spinner size="sm">Loading...</Spinner>
        <span> Logout in corso</span>
      </Alert>
      {alert && <Alert color={alertType}>{alert}</Alert>}
    </>
  );
}

export default Logout;
