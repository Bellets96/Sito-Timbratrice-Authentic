import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Alert, Spinner } from "reactstrap";
import { useAuth } from "../context/AuthContext";
import config from "../config.json";

function Redirect() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [searchParams] = useSearchParams();
  const code = searchParams.get("code");
  const [isLoading, setIsLoading] = useState(true);
  const [alertType, setAlertType] = useState("");
  const [alert, setAlert] = useState("");

  useEffect(() => {
    async function fetchDiscordApi(code) {
      const response = await fetch(config.apiUri + "/auth/discord", {
        method: "POST",
        body: JSON.stringify({ code: code }),
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      });
      const data = await response.json();
      setAlertType(data.type);
      setAlert(data.msg);
      if (response.ok) {
        if (!data.payload) {
          setTimeout(() => {
            navigate("/user/login", { state: { userData: data } });
          }, 1500);
        } else {
          setIsLoading(false);
          login(data.payload);
          setTimeout(() => {
            navigate("/");
          }, 1500);
        }
      } else {
        setIsLoading(false);
      }
    }

    fetchDiscordApi(code);
  }, [code, login, navigate]);

  if (isLoading) {
    return (
      <div>
        <Spinner>Loading...</Spinner>Verrai reindirizzato a breve...
      </div>
    );
  } else {
    return <Alert color={alertType}>{alert}</Alert>;
  }
}

export default Redirect;
