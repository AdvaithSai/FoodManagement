import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import AddRestaurant from "./AddRestaurant";

function OwnerDashboard() {

  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));
  const [restaurants, setRestaurants] = useState([]);

  const logout = () => {
    localStorage.removeItem("user");
    navigate("/");
  };

  useEffect(() => {
    axios.get(
      `http://localhost:8080/api/restaurants/owner/${user.id}`
    ).then(res => {
      setRestaurants(res.data);
    });
  }, [user.id]);

  return (
    <div className="page">

      <div style={{
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  marginBottom: "20px"
}}>

  <h1 className="page-title">Owner Dashboard</h1>

  <div>
    <button
      className="btn btn-primary"
      onClick={() => navigate("/owner/orders")}
    >
      View Orders 📦
    </button>

    <button
      className="btn btn-danger"
      onClick={logout}
      style={{ marginLeft: "10px" }}
    >
      Logout
    </button>
  </div>

</div>

      <h2 style={{ marginTop: "30px" }}>Your Restaurants</h2>

      {restaurants.length === 0 ? (
        <div className="card">
          <p>No restaurants yet</p>
        </div>
      ) : (
        restaurants.map(r => (
          <RestaurantCard key={r.id} restaurant={r} />
        ))
      )}

      <div className="card" style={{ marginTop: "30px" }}>
        <h3>Add New Restaurant</h3>
        <AddRestaurant />
      </div>

    </div>
  );
}

function RestaurantCard({ restaurant }) {

  const [dishes, setDishes] = useState([]);
  const [newDish, setNewDish] = useState({
    name: "",
    description: "",
    price: ""
  });

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

    setDishes(dishes.filter(d => d.id !== dishId));
  };

  const addDish = async (e) => {
    e.preventDefault();

    await axios.post(
      `http://localhost:8080/api/dishes/add/${restaurant.id}`,
      newDish
    );

    setNewDish({ name: "", description: "", price: "" });

    const res = await axios.get(
      `http://localhost:8080/api/dishes/restaurant/${restaurant.id}`
    );

    setDishes(res.data);
  };

  return (
    <div className="card" style={{ marginTop: "20px" }}>

      {/* Restaurant Header */}
      <div style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center"
      }}>
        <div>
          <h3>{restaurant.name}</h3>
          <p style={{ color: "gray" }}>{restaurant.city}</p>
        </div>
      </div>

      <hr />

      {/* Dishes Section */}
      <h4>Dishes</h4>

      {dishes.length === 0 ? (
        <p>No dishes yet</p>
      ) : (
        dishes.map(d => (
          <div
            key={d.id}
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginBottom: "8px",
              padding: "8px 0"
            }}
          >
            <span>
              {d.name} — ₹{d.price}
            </span>

            <button
              className="btn btn-danger"
              onClick={() => deleteDish(d.id)}
            >
              Delete
            </button>
          </div>
        ))
      )}

      <hr />

      {/* Add Dish Section */}
      <h4>Add Dish</h4>

      <form onSubmit={addDish}
        style={{
          display: "flex",
          gap: "10px",
          flexWrap: "wrap"
        }}
      >
        <input
          className="input"
          placeholder="Name"
          value={newDish.name}
          onChange={e =>
            setNewDish({ ...newDish, name: e.target.value })
          }
        />

        <input
          className="input"
          placeholder="Description"
          value={newDish.description}
          onChange={e =>
            setNewDish({ ...newDish, description: e.target.value })
          }
        />

        <input
          className="input"
          placeholder="Price"
          value={newDish.price}
          onChange={e =>
            setNewDish({ ...newDish, price: e.target.value })
          }
        />

        <button className="btn btn-primary">
          Add
        </button>
      </form>

    </div>
  );
}

export default OwnerDashboard;