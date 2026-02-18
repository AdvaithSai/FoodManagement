import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import AddRestaurant from "./AddRestaurant";
import AddDish from "./AddDish";

function OwnerDashboard(){

  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));

  const [restaurants,setRestaurants] = useState([]);

  const logout = ()=>{
    localStorage.removeItem("user");
    navigate("/");
  };

  // Fetch restaurants
  useEffect(()=>{
    axios.get(
      `http://localhost:8080/api/restaurants/owner/${user.id}`
    ).then(res=>{
      setRestaurants(res.data);
    });
  },[user.id]);

  return(
    <div>
      <h1>Owner Dashboard</h1>

      <button onClick={logout}>Logout</button>

      <h2>Your Restaurants</h2>

      {restaurants.length === 0 ? (
        <p>No restaurants yet</p>
      ) : (
        restaurants.map(r=>(
          <div key={r.id}>
    <h3>{r.name}</h3>
    <p>{r.city}</p>

    <AddDish restaurantId={r.id}/>

    <hr/>
  </div>
        ))
      )}

      <AddRestaurant/>
    </div>
  );
  
}

export default OwnerDashboard;
