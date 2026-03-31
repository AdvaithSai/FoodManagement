import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Cart() {
  const user = JSON.parse(localStorage.getItem("user"));
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [placingOrder, setPlacingOrder] = useState(false);
  const [removingId, setRemovingId] = useState(null);
  const [updatingId, setUpdatingId] = useState(null);

  useEffect(() => {
    axios
      .get(`http://localhost:8080/api/cart/${user.id}`)
      .then((res) => { setCartItems(res.data); setLoading(false); })
      .catch(() => setLoading(false));
  }, [user.id]);

  const removeItem = async (cartItemId) => {
    setRemovingId(cartItemId);
    await axios.delete(`http://localhost:8080/api/cart/remove/${cartItemId}`);
    setCartItems((prev) => prev.filter((item) => item.id !== cartItemId));
    setRemovingId(null);
  };

  const updateQuantity = async (cartItemId, newQty) => {
    if (newQty <= 0) {
      removeItem(cartItemId);
      return;
    }
    setUpdatingId(cartItemId);
    try {
      await axios.put(`http://localhost:8080/api/cart/update/${cartItemId}/${newQty}`);
      setCartItems(prev =>
        prev.map(item =>
          item.id === cartItemId ? { ...item, quantity: newQty } : item
        )
      );
    } catch (err) {
      console.error(err);
    } finally {
      setUpdatingId(null);
    }
  };

  const placeOrder = async () => {
    setPlacingOrder(true);
    await axios.post(`http://localhost:8080/api/orders/place/${user.id}`);
    setCartItems([]);
    setPlacingOrder(false);
    navigate("/orders");
  };

  // Group items by restaurant
  const grouped = cartItems.reduce((acc, item) => {
    const rId = item.dish?.restaurant?.id || "unknown";
    if (!acc[rId]) acc[rId] = { restaurant: item.dish?.restaurant, items: [] };
    acc[rId].items.push(item);
    return acc;
  }, {});

  const totalItems = cartItems.reduce((sum, item) => sum + (item.quantity || 1), 0);
  const subtotal = cartItems.reduce((sum, item) => sum + item.dish.price * (item.quantity || 1), 0);
  const deliveryFee = cartItems.length > 0 ? 30 : 0;
  const total = subtotal + deliveryFee;

  /* ── Quantity stepper component ── */
  const QuantityStepper = ({ item }) => {
    const qty = item.quantity || 1;
    const isUpdating = updatingId === item.id;

    const btnStyle = (disabled) => ({
      width: "30px", height: "30px",
      border: "1.5px solid #e5e7eb", borderRadius: "8px",
      background: disabled ? "#f3f4f6" : "white",
      cursor: disabled ? "not-allowed" : "pointer",
      display: "flex", alignItems: "center", justifyContent: "center",
      fontSize: "16px", fontWeight: 700, color: disabled ? "#9ca3af" : "#1f2937",
      transition: "all 0.15s",
      flexShrink: 0,
    });

    return (
      <div style={{
        display: "flex", alignItems: "center", gap: "2px",
        background: "#f9fafb", borderRadius: "10px",
        padding: "3px", border: "1px solid #f3f4f6",
      }}>
        <button
          onClick={() => updateQuantity(item.id, qty - 1)}
          disabled={isUpdating}
          style={btnStyle(isUpdating)}
          onMouseEnter={e => { if (!isUpdating) e.currentTarget.style.borderColor = "#ff6b00"; }}
          onMouseLeave={e => e.currentTarget.style.borderColor = "#e5e7eb"}
          title={qty === 1 ? "Remove item" : "Decrease"}
        >
          {qty === 1 ? "🗑️" : "−"}
        </button>

        <span style={{
          minWidth: "32px", textAlign: "center",
          fontWeight: 800, fontSize: "15px", color: "#1f2937",
          opacity: isUpdating ? 0.5 : 1,
        }}>
          {qty}
        </span>

        <button
          onClick={() => updateQuantity(item.id, qty + 1)}
          disabled={isUpdating}
          style={btnStyle(isUpdating)}
          onMouseEnter={e => { if (!isUpdating) e.currentTarget.style.borderColor = "#ff6b00"; }}
          onMouseLeave={e => e.currentTarget.style.borderColor = "#e5e7eb"}
          title="Increase"
        >
          +
        </button>
      </div>
    );
  };

  if (loading) return (
    <div className="page" style={{ textAlign: "center", paddingTop: "100px" }}>
      <div style={{ fontSize: "48px", marginBottom: "16px" }}>🛒</div>
      <p style={{ color: "#9ca3af", fontSize: "16px" }}>Loading your cart...</p>
    </div>
  );

  return (
    <div className="page" style={{ maxWidth: "900px" }}>

      {/* ── Header ── */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "30px", flexWrap: "wrap", gap: "12px" }}>
        <div>
          <h1 style={{ margin: 0, fontSize: "28px", fontWeight: 700, color: "#1f2937" }}>
            🛒 Your Cart
          </h1>
          <p style={{ margin: "4px 0 0", color: "#9ca3af", fontSize: "14px" }}>
            {totalItems} item{totalItems !== 1 ? "s" : ""} in cart
          </p>
        </div>
        <button
          onClick={() => navigate("/customer")}
          style={{
            background: "none", border: "2px solid #e5e7eb", borderRadius: "10px",
            padding: "8px 16px", cursor: "pointer", fontWeight: 600, color: "#6b7280",
            fontSize: "14px", display: "flex", alignItems: "center", gap: "6px",
          }}
        >
          ← Continue Shopping
        </button>
      </div>

      {cartItems.length === 0 ? (
        /* ── Empty State ── */
        <div style={{ textAlign: "center", padding: "80px 20px" }}>
          <div style={{ fontSize: "72px", marginBottom: "16px" }}>🛍️</div>
          <h2 style={{ color: "#1f2937", marginBottom: "8px", fontWeight: 700 }}>Your cart is empty</h2>
          <p style={{ color: "#9ca3af", marginBottom: "28px" }}>
            Looks like you haven't added anything yet. Explore our restaurants!
          </p>
          <button
            className="btn btn-primary"
            onClick={() => navigate("/customer")}
            style={{ borderRadius: "10px", padding: "13px 28px", fontSize: "15px", fontWeight: 700 }}
          >
            Browse Restaurants 🍕
          </button>
        </div>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "1fr 340px", gap: "24px", alignItems: "start" }}>

          {/* ── Left: Cart Items ── */}
          <div>
            {Object.values(grouped).map(({ restaurant, items }) => (
              <div key={restaurant?.id} style={{
                background: "white", borderRadius: "16px",
                boxShadow: "0 4px 16px rgba(0,0,0,0.07)",
                overflow: "hidden", marginBottom: "20px",
                border: "1px solid #f3f4f6",
              }}>
                {/* Restaurant header */}
                {restaurant && (
                  <div style={{
                    padding: "14px 20px",
                    background: "linear-gradient(135deg, #fff8f4, #fff3ea)",
                    borderBottom: "1px solid #fde8d4",
                    display: "flex", alignItems: "center", gap: "10px",
                  }}>
                    <span style={{ fontSize: "22px" }}>🏪</span>
                    <div>
                      <div style={{ fontWeight: 700, fontSize: "15px", color: "#1f2937" }}>{restaurant.name}</div>
                      <div style={{ fontSize: "12px", color: "#9ca3af" }}>📍 {restaurant.city}</div>
                    </div>
                  </div>
                )}

                {/* Items */}
                <div style={{ padding: "8px 0" }}>
                  {items.map((item, idx) => {
                    const qty = item.quantity || 1;
                    const lineTotal = item.dish.price * qty;

                    return (
                      <div
                        key={item.id}
                        style={{
                          display: "flex", alignItems: "center", gap: "14px",
                          padding: "14px 20px",
                          borderBottom: idx < items.length - 1 ? "1px solid #f9fafb" : "none",
                          opacity: removingId === item.id ? 0.4 : 1,
                          transition: "opacity 0.3s",
                        }}
                      >
                        {/* Dish icon bubble */}
                        <div style={{
                          width: "48px", height: "48px", borderRadius: "12px",
                          background: "linear-gradient(135deg, #fff3ea, #ffe8d4)",
                          display: "flex", alignItems: "center", justifyContent: "center",
                          fontSize: "22px", flexShrink: 0,
                        }}>
                          🍽️
                        </div>

                        {/* Info */}
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ fontWeight: 600, fontSize: "15px", color: "#1f2937" }}>
                            {item.dish.name}
                          </div>
                          {item.dish.description && (
                            <div style={{ fontSize: "12px", color: "#9ca3af", marginTop: "2px", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                              {item.dish.description}
                            </div>
                          )}
                          <div style={{ fontSize: "12px", color: "#6b7280", marginTop: "4px" }}>
                            ₹{item.dish.price} each
                          </div>
                        </div>

                        {/* Quantity stepper */}
                        <QuantityStepper item={item} />

                        {/* Line total */}
                        <div style={{ fontWeight: 700, fontSize: "16px", color: "#ff6b00", flexShrink: 0, minWidth: "60px", textAlign: "right" }}>
                          ₹{lineTotal.toFixed(2)}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>

          {/* ── Right: Order Summary ── */}
          <div style={{
            background: "white", borderRadius: "16px",
            boxShadow: "0 4px 20px rgba(0,0,0,0.09)",
            padding: "24px", border: "1px solid #f3f4f6",
            position: "sticky", top: "20px",
          }}>
            <h2 style={{ margin: "0 0 20px", fontSize: "18px", fontWeight: 700, color: "#1f2937" }}>
              Order Summary
            </h2>

            {/* Item breakdown */}
            <div style={{ marginBottom: "14px" }}>
              {cartItems.map(item => {
                const qty = item.quantity || 1;
                return (
                  <div key={item.id} style={{ display: "flex", justifyContent: "space-between", fontSize: "13px", color: "#6b7280", marginBottom: "6px" }}>
                    <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", maxWidth: "180px" }}>
                      {item.dish.name} × {qty}
                    </span>
                    <span style={{ fontWeight: 600, color: "#374151" }}>₹{(item.dish.price * qty).toFixed(2)}</span>
                  </div>
                );
              })}
            </div>

            {/* Price breakdown */}
            <div style={{ borderTop: "1px dashed #e5e7eb", paddingTop: "12px", marginBottom: "14px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
                <span style={{ color: "#6b7280", fontSize: "14px" }}>
                  Subtotal ({totalItems} item{totalItems !== 1 ? "s" : ""})
                </span>
                <span style={{ fontWeight: 600, fontSize: "14px", color: "#1f2937" }}>₹{subtotal.toFixed(2)}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "14px" }}>
                <span style={{ color: "#6b7280", fontSize: "14px" }}>Delivery Fee</span>
                <span style={{ fontWeight: 600, fontSize: "14px", color: "#1f2937" }}>₹{deliveryFee.toFixed(2)}</span>
              </div>

              <div style={{ borderTop: "2px dashed #e5e7eb", paddingTop: "14px", display: "flex", justifyContent: "space-between" }}>
                <span style={{ fontWeight: 700, fontSize: "16px", color: "#1f2937" }}>Total</span>
                <span style={{ fontWeight: 800, fontSize: "20px", color: "#ff6b00" }}>₹{total.toFixed(2)}</span>
              </div>
            </div>

            {/* Promo / info strip */}
            <div style={{
              background: "#f0fdf4", border: "1px solid #bbf7d0",
              borderRadius: "10px", padding: "10px 14px",
              display: "flex", alignItems: "center", gap: "8px",
              marginBottom: "20px",
            }}>
              <span style={{ fontSize: "16px" }}>🚀</span>
              <span style={{ fontSize: "12px", color: "#15803d", fontWeight: 500 }}>
                Fast delivery — estimated 30–45 mins
              </span>
            </div>

            {/* Place Order Button */}
            <button
              onClick={placeOrder}
              disabled={placingOrder}
              style={{
                width: "100%",
                padding: "15px",
                background: placingOrder
                  ? "#e5e7eb"
                  : "linear-gradient(135deg, #ff6b00, #ff9f45)",
                color: placingOrder ? "#9ca3af" : "white",
                border: "none",
                borderRadius: "12px",
                cursor: placingOrder ? "not-allowed" : "pointer",
                fontWeight: 800,
                fontSize: "16px",
                boxShadow: placingOrder ? "none" : "0 4px 14px rgba(255,107,0,0.35)",
                transition: "all 0.2s",
                letterSpacing: "0.3px",
              }}
              onMouseEnter={e => { if (!placingOrder) e.currentTarget.style.opacity = "0.9"; }}
              onMouseLeave={e => e.currentTarget.style.opacity = "1"}
            >
              {placingOrder ? "Placing Order..." : "Place Order 🎉"}
            </button>

            <p style={{ textAlign: "center", color: "#9ca3af", fontSize: "12px", marginTop: "12px" }}>
              🔒 Secure & safe checkout
            </p>
          </div>

        </div>
      )}
    </div>
  );
}

export default Cart;

