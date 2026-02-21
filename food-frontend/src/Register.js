import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";


function Register() {

  const navigate = useNavigate();

  const [user, setUser] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    role: "CUSTOMER"
  });

  const register = async (e) => {
    e.preventDefault();

    try {
      await axios.post(
        "http://localhost:8080/api/auth/register",
        user
      );

      alert("Registration successful!");

      navigate("/"); // go back to login

    } catch (err) {
      alert("Registration failed");
      console.log(err);
    }
  };

  return (
  <div className="page">
    <div className="card" style={{ maxWidth: "500px", margin: "auto" }}>
      <h2 className="page-title">Create Account</h2>

      <form onSubmit={register}>

        <input
          className="input"
          placeholder="Name"
          onChange={e => setUser({...user, name: e.target.value})}
        />

        <input
          className="input"
          placeholder="Email"
          onChange={e => setUser({...user, email: e.target.value})}
        />

        <input
          className="input"
          type="password"
          placeholder="Password"
          onChange={e => setUser({...user, password: e.target.value})}
        />

        <input
          className="input"
          placeholder="Phone"
          onChange={e => setUser({...user, phone: e.target.value})}
        />

        <select
          className="input"
          onChange={e => setUser({...user, role: e.target.value})}
        >
          <option value="CUSTOMER">Customer</option>
          <option value="OWNER">Restaurant Owner</option>
        </select>

        <br /><br />
        <a href="http://localhost:8080/oauth2/authorization/google">
  
</a>

        <button className="btn btn-primary">
          Register
        </button>

      </form>

      {/* 🔥 Login Link Added Here */}
      <p style={{ marginTop: "15px" }}>
        Already have an account?{" "}
        <a href="/" style={{ color: "#ff6b00", fontWeight: "500" }}>
          Login
        </a>
      </p>

    </div>
  </div>
);

}

export default Register;
