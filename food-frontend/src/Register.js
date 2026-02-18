import { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";

function Register() {
  const navigate = useNavigate();

  const [user,setUser] = useState({
    name:"",
    email:"",
    password:"",
    phone:"",
    role:"CUSTOMER"
  });

  const submit = async e => {
    e.preventDefault();

    const res = await axios.post(
      "http://localhost:8080/api/auth/register",
      user
    );

    alert("Registered successfully!");

    // Save user
    localStorage.setItem("user", JSON.stringify(res.data));

    // Redirect based on role
    if(res.data.role === "OWNER"){
      navigate("/owner");
    } else {
      navigate("/customer");
    }
  };

  return (
    <form onSubmit={submit}>
      <h2>Register</h2>

      <input placeholder="Name"
        onChange={e=>setUser({...user,name:e.target.value})}/>

      <input placeholder="Email"
        onChange={e=>setUser({...user,email:e.target.value})}/>

      <input placeholder="Phone"
        onChange={e=>setUser({...user,phone:e.target.value})}/>

      <input type="password" placeholder="Password"
        onChange={e=>setUser({...user,password:e.target.value})}/>

      <select
        value={user.role}
        onChange={e=>setUser({...user,role:e.target.value})}
      >
        <option value="CUSTOMER">Customer</option>
        <option value="OWNER">Restaurant Owner</option>
      </select>

      <button>Register</button>

      <p>
        Already have an account? <Link to="/">Login</Link>
      </p>
    </form>
  );
}

export default Register;
