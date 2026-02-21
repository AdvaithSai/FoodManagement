import { useEffect, useState } from "react";
import axios from "./axiosConfig";

function OrderHistory() {

  const user = JSON.parse(localStorage.getItem("user"));
  const [orders, setOrders] = useState([]);

  const fetchOrders = () => {
    axios.get(`/api/orders/user/${user.id}`)
      .then(res => {
        setOrders(res.data);
      })
      .catch(err => console.error(err));
  };

  useEffect(() => {
    fetchOrders();
  }, [user.id]);

  const updateStatus = async (orderId) => {
    try {
      await axios.put(`/api/orders/status/${orderId}/DELIVER`);

      // Refresh orders from backend
      fetchOrders();
    } catch (err) {
      console.error(err);
    }
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

            {/* ✅ SHOW DELIVER BUTTON ONLY WHEN SHIPPED */}
            {order.status === "SHIPPED" && (
              <button
                onClick={() => updateStatus(order.id)}
                style={{
                  marginTop: "12px",
                  backgroundColor: "#10b981",
                  color: "white",
                  border: "none",
                  padding: "8px 14px",
                  borderRadius: "6px",
                  cursor: "pointer"
                }}
              >
                Mark as Delivered ✅
              </button>
            )}

          </div>
        ))
      )}

    </div>
  );
}

export default OrderHistory;