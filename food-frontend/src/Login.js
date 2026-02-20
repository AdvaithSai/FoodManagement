import { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";

function Login() {

  const navigate = useNavigate();

  const [loginUser, setLoginUser] = useState({
    email: "",
    password: ""
  });

  const login = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post(
        "http://localhost:8080/api/auth/login",
        loginUser
      );

      if (res.data) {
        localStorage.setItem("user", JSON.stringify(res.data));

        // redirect based on role
        if (res.data.role === "OWNER") {
          navigate("/owner");
        } else {
          navigate("/customer");
        }

      } else {
        alert("Invalid credentials");
      }

    } catch (err) {
      alert("Login failed");
    }
  };

  return (
  <div className="page">
    <div className="card" style={{ maxWidth: "400px", margin: "auto" }}>
      <h2 className="page-title">Login</h2>

      <form onSubmit={login}>
        <input
          className="input"
          placeholder="Email"
          onChange={e =>
            setLoginUser({ ...loginUser, email: e.target.value })
          }
        />
<br /><br />
        <input
          className="input"
          type="password"
          placeholder="Password"
          onChange={e =>
            setLoginUser({ ...loginUser, password: e.target.value })
          }
        />

        <br /><br />

        <button className="btn btn-primary">Login</button>
      </form>

      <p>
        New user? <Link to="/register">Register</Link>
      </p>
    </div>
  </div>
);

}

export default Login;
