import { useEffect, useState } from "react";
import axios from "axios";

function Cart() {

  const user = JSON.parse(localStorage.getItem("user"));
  const [cartItems, setCartItems] = useState([]);

  useEffect(() => {
    axios.get(
      `http://localhost:8080/api/cart/${user.id}`
    ).then(res => {
      setCartItems(res.data);
    });
  }, [user.id]);

  const removeItem = async (cartId) => {
    await axios.delete(
      `http://localhost:8080/api/cart/remove/${cartId}`
    );

    setCartItems(cartItems.filter(item => item.id !== cartId));
  };

  const placeOrder = async () => {

    await axios.post(
      `http://localhost:8080/api/orders/place/${user.id}`
    );

    alert("Order placed successfully!");

    setCartItems([]);
  };

  const total = cartItems.reduce(
    (sum, item) => sum + item.dish.price,
    0
  );

  return (
    <div className="page">

      <h1 className="page-title">Your Cart 🛒</h1>

      {cartItems.length === 0 ? (
        <div className="card">
          <p>Your cart is empty.</p>
        </div>
      ) : (
        <>
          {cartItems.map(item => (
            <div key={item.id} className="card">

              <h3>{item.dish.name}</h3>
              <p style={{ color: "gray" }}>
                ₹{item.dish.price}
              </p>

              <button
                className="btn btn-danger"
                onClick={() => removeItem(item.id)}
              >
                Remove
              </button>

            </div>
          ))}

          {/* TOTAL SECTION */}
          <div className="card" style={{ marginTop: "20px" }}>

            <h3>Total: ₹{total}</h3>

            <button
              className="btn btn-success"
              onClick={placeOrder}
            >
              Place Order
            </button>

          </div>
        </>
      )}

    </div>
  );
}

export default Cart;
