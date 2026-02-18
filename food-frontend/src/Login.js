import { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";

function Login() {
  const [data,setData] = useState({email:"",password:""});
  const navigate = useNavigate();

  const login = async () => {
    const res = await axios.post(
      "http://localhost:8080/api/auth/login",
      data
    );

    if(!res.data){
      alert("Invalid credentials");
      return;
    }

    const role = res.data.role;

    // SAVE USER (optional but useful)
    localStorage.setItem("user", JSON.stringify(res.data));

    if(role === "OWNER"){
      navigate("/owner");
    } else {
      navigate("/customer");
    }
  };

  return (
    <div>
      <h2>Login</h2>

      <input placeholder="Email"
        onChange={e=>setData({...data,email:e.target.value})}/>

      <input type="password" placeholder="Password"
        onChange={e=>setData({...data,password:e.target.value})}/>

      <button onClick={login}>Login</button>

      <p>
        New user? <Link to="/register">Register here</Link>
      </p>
    </div>
  );
}

export default Login;
