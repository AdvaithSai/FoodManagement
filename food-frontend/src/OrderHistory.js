import { useEffect, useState } from "react";
import axios from "./axiosConfig";


function OrderHistory(){

  const user = JSON.parse(localStorage.getItem("user"));
  const [orders,setOrders] = useState([]);

  useEffect(()=>{
    axios.get(
      `http://localhost:8080/api/orders/user/${user.id}`
    ).then(res=>{
      setOrders(res.data);
    });
  },[user.id]);
  const updateStatus = async (orderId,action)=>{
  await axios.put(
    `http://localhost:8080/api/orders/status/${orderId}/${action}`
  );

  setOrders(orders.map(o =>
    o.id === orderId
      ? {...o,status: action === "DELIVER" ? "DELIVERED" : o.status}
      : o
  ));
};


  return (
  <div className="page">

    <h1 className="page-title">Your Orders</h1>

    {orders.length === 0 ? (
      <p>No orders yet</p>
    ) : (
      orders.map(order => (
        <div key={order.id} className="card">

          <h3>Order #{order.id}</h3>
          <p><strong>Restaurant:</strong> {order.restaurantName}</p>
          <p><strong>Status:</strong> {order.status}</p>
          <p><strong>Date:</strong> {order.createdAt}</p>

          <h4>Items:</h4>
          {order.items.map(item => (
            <div key={item.id}>
              {item.dish.name} - ₹{item.dish.price}
            </div>
          ))}

        </div>
      ))
    )}

  </div>
);

}

export default OrderHistory;
