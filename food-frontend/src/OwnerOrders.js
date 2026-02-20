import { useEffect, useState } from "react";
import axios from "./axiosConfig";


function OwnerOrders() {

  const user = JSON.parse(localStorage.getItem("user"));
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    axios.get(
      `http://localhost:8080/api/orders/owner/${user.id}`
    ).then(res => {
      setOrders(res.data);
    });
  }, [user.id]);

  const updateStatus = async (orderId, action) => {

    await axios.put(
      `http://localhost:8080/api/orders/status/${orderId}/${action}`
    );

    // Update local state properly
    setOrders(prev =>
      prev.map(o => {
        if (o.id !== orderId) return o;

        let newStatus = o.status;

        if (action === "ACCEPT") newStatus = "PREPARING";
        if (action === "DECLINE") newStatus = "DECLINED";
        if (action === "SHIP") newStatus = "SHIPPED";

        return { ...o, status: newStatus };
      })
    );
  };

  const activeOrders = orders.filter(
    o => o.status !== "DELIVERED" && o.status !== "DECLINED"
  );

  const previousOrders = orders.filter(
    o => o.status === "DELIVERED" || o.status === "DECLINED"
  );

  return (
    <div>
      <h2>Active Orders</h2>

      {activeOrders.length === 0 ? (
        <p>No active orders</p>
      ) : (
        activeOrders.map(order => {

          const restaurantName =
            order.items?.[0]?.dish?.restaurant?.name;

          return (
            <div key={order.id}
                 style={{ border: "1px solid gray", padding: "10px", margin: "10px" }}>

              <h3>Order #{order.id}</h3>
              <p><b>Restaurant:</b> {restaurantName}</p>
              <p><b>Status:</b> {order.status}</p>
              <p><b>Date:</b> {order.createdAt}</p>

              <h4>Items:</h4>

              {order.items?.map(item => (
                <div key={item.id}>
                  {item.dish.name} - ₹{item.dish.price}
                </div>
              ))}

              <br />

              {order.status === "PLACED" && (
                <>
                  <button onClick={() => updateStatus(order.id, "ACCEPT")}>
                    Accept
                  </button>

                  <button onClick={() => updateStatus(order.id, "DECLINE")}>
                    Decline
                  </button>
                </>
              )}

              {order.status === "PREPARING" && (
                <button onClick={() => updateStatus(order.id, "SHIP")}>
                  Mark as Shipped
                </button>
              )}

            </div>
          );
        })
      )}

      <h2>Previous Orders</h2>

      {previousOrders.length === 0 ? (
        <p>No previous orders</p>
      ) : (
        previousOrders.map(order => {

          const restaurantName =
            order.items?.[0]?.dish?.restaurant?.name;

          return (
            <div key={order.id}
                 style={{ border: "1px solid lightgray", padding: "10px", margin: "10px" }}>

              <h3>Order #{order.id}</h3>
              <p><b>Restaurant:</b> {restaurantName}</p>
              <p><b>Status:</b> {order.status}</p>
              <p><b>Date:</b> {order.createdAt}</p>

            </div>
          );
        })
      )}
    </div>
  );
}

export default OwnerOrders;
