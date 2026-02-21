import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function OAuthSuccess() {

  const navigate = useNavigate();

  useEffect(() => {

    const params = new URLSearchParams(window.location.search);
    const email = params.get("email");

    axios.post("http://localhost:8080/api/auth/login",
      { email: email, password: "" }
    ).then(res => {

      localStorage.setItem("user", JSON.stringify(res.data));

      if (res.data.role === "OWNER") {
        navigate("/owner");
      } else {
        navigate("/customer");
      }
    });

  }, [navigate]);

  return <p>Logging you in...</p>;
}

export default OAuthSuccess;