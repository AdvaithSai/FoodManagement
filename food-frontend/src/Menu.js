import { useEffect, useState } from "react";
import axios from "axios";
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

  return(
    <div>
      <h2>Menu</h2>

      {dishes.length === 0 ? (
        <p>No dishes available</p>
      ) : (
        dishes.map(d=>(
          <div key={d.id}>
            <h3>{d.name}</h3>
            <p>{d.description}</p>
            <p>₹ {d.price}</p>
            <button onClick={()=>addToCart(d.id)}>
  Add to Cart
</button>

            <hr/>
          </div>
        ))
      )}
    </div>
  );
}

export default Menu;
