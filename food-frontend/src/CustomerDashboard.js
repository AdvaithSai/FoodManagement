import { useEffect, useState } from "react";
import axios from "./axiosConfig";

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

  return (
  <div className="page">

    <h1 className="page-title">Customer Dashboard</h1>

    {/* Top Action Buttons */}
    <div style={{ marginBottom: "20px" }}>
      <button className="btn btn-danger" onClick={logout}>
        Logout
      </button>

      <Link to="/cart">
        <button className="btn btn-primary">
          View Cart 🛒
        </button>
      </Link>

      <Link to="/orders">
        <button className="btn btn-success">
          Order History 📜
        </button>
      </Link>
    </div>

    <h2 style={{ marginBottom: "20px" }}>
      Available Restaurants
    </h2>

    {restaurants.length === 0 ? (
      <p>No restaurants available</p>
    ) : (
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))",
        gap: "20px"
      }}>
        {restaurants.map(r => (
          <div key={r.id} className="card">

            <h3>{r.name}</h3>
            <p style={{ color: "gray" }}>{r.city}</p>

            <Link to={`/menu/${r.id}`}>
              <button className="btn btn-primary">
                View Menu
              </button>
            </Link>

          </div>
        ))}
      </div>
    )}

  </div>
);

}

export default CustomerDashboard;
