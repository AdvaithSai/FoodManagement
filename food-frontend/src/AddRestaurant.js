import { useState } from "react";
import axios from "axios";

function AddRestaurant() {

  const user = JSON.parse(localStorage.getItem("user"));

  const [restaurant, setRestaurant] = useState({
    name: "",
    description: "",
    address: "",
    city: ""
  });

  const submit = async (e) => {
    e.preventDefault();

    await axios.post(
      `http://localhost:8080/api/restaurants/add/${user.id}`,
      restaurant
    );

    alert("Restaurant added!");

    setRestaurant({
      name: "",
      description: "",
      address: "",
      city: ""
    });
  };

  return (
    <form onSubmit={submit} style={{ marginTop: "15px" }}>

      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
        gap: "10px"
      }}>

        <input
          className="input"
          placeholder="Restaurant Name"
          value={restaurant.name}
          onChange={e =>
            setRestaurant({ ...restaurant, name: e.target.value })
          }
        />

        <input
          className="input"
          placeholder="City"
          value={restaurant.city}
          onChange={e =>
            setRestaurant({ ...restaurant, city: e.target.value })
          }
        />

        <input
          className="input"
          placeholder="Address"
          value={restaurant.address}
          onChange={e =>
            setRestaurant({ ...restaurant, address: e.target.value })
          }
        />

        <input
          className="input"
          placeholder="Description"
          value={restaurant.description}
          onChange={e =>
            setRestaurant({ ...restaurant, description: e.target.value })
          }
        />

      </div>

      <br />

      <button className="btn btn-primary">
        Add Restaurant
      </button>

    </form>
  );
}

export default AddRestaurant;