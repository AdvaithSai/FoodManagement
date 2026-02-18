import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function CustomerDashboard(){

  const navigate = useNavigate();
  const [restaurants,setRestaurants] = useState([]);

  const logout = ()=>{
    localStorage.removeItem("user");
    navigate("/");
  };

  useEffect(()=>{
    axios.get("http://localhost:8080/api/restaurants/all")
      .then(res=>{
        setRestaurants(res.data);
      });
  },[]);

  return(
    <div>
      <h1>Customer Dashboard</h1>

      <button onClick={logout}>Logout</button>

      <h2>Available Restaurants</h2>

      {restaurants.length === 0 ? (
        <p>No restaurants available</p>
      ) : (
        restaurants.map(r=>(
          <div key={r.id}>
            <h3>{r.name}</h3>
            <p>{r.description}</p>
            <p>{r.city}</p>
            <hr/>
          </div>
        ))
      )}

    </div>
  );
}

export default CustomerDashboard;
