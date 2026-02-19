import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";


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
      <br/><br/>

<Link to="/cart">
  <button>View Cart 🛒</button>
</Link>

      <h2>Available Restaurants</h2>

      {restaurants.length === 0 ? (
        <p>No restaurants available</p>
      ) : (
        restaurants.map(r=>(
            <div key={r.id}>
    <h3>{r.name}</h3>
    <p>{r.city}</p>

    <Link to={`/menu/${r.id}`}>
      View Menu
    </Link>

    <hr/>
  </div>
        ))
      )}

    </div>
  );
}

export default CustomerDashboard;
