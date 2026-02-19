import { useEffect, useState } from "react";
import axios from "axios";

function Cart(){

  const user = JSON.parse(localStorage.getItem("user"));
  const [items,setItems] = useState([]);

  useEffect(()=>{
    axios.get(
      `http://localhost:8080/api/cart/${user.id}`
    ).then(res=>{
      setItems(res.data);
    });
  },[user.id]);

  const remove = async (id)=>{
    await axios.delete(
      `http://localhost:8080/api/cart/remove/${id}`
    );
    window.location.reload();
  };

  return(
    <div>
      <h2>Your Cart</h2>

      {items.length===0 ? (
        <p>Cart empty</p>
      ) : (
        items.map(i=>(
          <div key={i.id}>
            <h3>{i.dish.name}</h3>
            <p>₹ {i.dish.price}</p>
            <button onClick={()=>remove(i.id)}>
              Remove
            </button>
            <hr/>
          </div>
        ))
      )}
    </div>
  );
}

export default Cart;
