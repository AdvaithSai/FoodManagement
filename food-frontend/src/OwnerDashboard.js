import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "./axiosConfig";

import AddRestaurant from "./AddRestaurant";
import AddDish from "./AddDish";



function OwnerDashboard() {

  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));

  const [restaurants, setRestaurants] = useState([]);

  const logout = () => {
    localStorage.removeItem("user");
    navigate("/");
  };

  // Fetch restaurants of owner
  useEffect(() => {
    axios.get(
      `http://localhost:8080/api/restaurants/owner/${user.id}`
    ).then(res => {
      setRestaurants(res.data);
    });
  }, [user.id]);

  return (
  <div className="page">

    <h1 className="page-title">Owner Dashboard</h1>

    <button className="btn btn-danger" onClick={logout}>
      Logout
    </button>

    <h2 style={{ marginTop: "30px" }}>Your Restaurants</h2>

    {restaurants.length === 0 ? (
      <p>No restaurants yet</p>
    ) : (
      restaurants.map(r => (
        <div key={r.id} className="card">

          <h3>{r.name}</h3>
          <p style={{ color: "gray" }}>{r.city}</p>

          <RestaurantBlock restaurant={r} />

        </div>
      ))
    )}

    <div className="card">
      <AddRestaurant />
    </div>

  </div>
);

}

function RestaurantBlock({ restaurant }) {

  const [dishes, setDishes] = useState([]);

  // Fetch dishes of this restaurant
  useEffect(() => {
    axios.get(
      `http://localhost:8080/api/dishes/restaurant/${restaurant.id}`
    ).then(res => {
      setDishes(res.data);
    });
  }, [restaurant.id]);

  const deleteDish = async (dishId) => {
    await axios.delete(
      `http://localhost:8080/api/dishes/delete/${dishId}`
    );

    // Remove dish from state (no page reload)
    setDishes(dishes.filter(d => d.id !== dishId));
  };

  return (
    <div style={{ border: "1px solid gray", padding: "10px", margin: "10px 0" }}>
      <h3>{restaurant.name}</h3>
      <p>{restaurant.city}</p>

      <h4>Dishes</h4>

      {dishes.length === 0 ? (
        <p>No dishes yet</p>
      ) : (
        dishes.map(d => (
          <div key={d.id}>
            {d.name} - ₹{d.price}
            <button
              style={{ marginLeft: "10px" }}
              onClick={() => deleteDish(d.id)}
            >
              Delete
            </button>
          </div>
        ))
      )}

      <h4>Add Dish</h4>
      <AddDish restaurantId={restaurant.id} />
    </div>
  );
}

export default OwnerDashboard;
