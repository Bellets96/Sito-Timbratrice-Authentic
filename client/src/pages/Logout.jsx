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
      }
    }

    getLogout();
  }, [login, navigate]);

  return (
    <>
      <div className="d-flex flex-column align-items-center mt-5">
        {alert ? (
          <Alert color={alertType}>{alert}</Alert>
        ) : (
          <Alert color="warning">
            <Spinner size="sm">Loading...</Spinner> Logout in corso
          </Alert>
        )}
      </div>
    </>
  );
}

export default Logout;
