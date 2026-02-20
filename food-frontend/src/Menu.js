import { useEffect, useState } from "react";
import axios from "./axiosConfig";

import { useParams } from "react-router-dom";

function Menu(){

  const { id } = useParams();
  const [dishes,setDishes] = useState([]);
  const user = JSON.parse(localStorage.getItem("user"));

const addToCart = async (dishId)=>{
  await axios.post(
    `http://localhost:8080/api/cart/add/${user.id}/${dishId}`
  );
  alert("Added to cart");
};


  useEffect(()=>{
    axios.get(
      `http://localhost:8080/api/dishes/restaurant/${id}`
    ).then(res=>{
      setDishes(res.data);
    });
  },[id]);

  return (
  <div className="page">

    <h1 className="page-title">Menu</h1>

    {dishes.length === 0 ? (
      <p>No dishes available</p>
    ) : (
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))",
        gap: "20px"
      }}>
        {dishes.map(d => (
          <div key={d.id} className="card">

            <h3>{d.name}</h3>
            <p style={{ color: "gray" }}>{d.description}</p>
            <p><strong>₹{d.price}</strong></p>

            <button
              className="btn btn-primary"
              onClick={() => addToCart(d.id)}
            >
              Add to Cart 🛒
            </button>

          </div>
        ))}
      </div>
    )}

  </div>
);

}

export default Menu;
