import { useEffect, useState } from "react";
import axios from "./axiosConfig";
import { useNavigate } from "react-router-dom";

/* ─── Status config ─────────────────────────────────────────── */
const STATUS_CONFIG = {
  PLACED: {
    label: "Order Placed", icon: "🧾",
    color: "#f59e0b", bg: "#fffbeb", border: "#fde68a", step: 0,
  },
  PREPARING: {
    label: "Preparing", icon: "👨‍🍳",
    color: "#3b82f6", bg: "#eff6ff", border: "#bfdbfe", step: 1,
  },
  SHIPPED: {
    label: "Out for Delivery", icon: "🚴",
    color: "#8b5cf6", bg: "#f5f3ff", border: "#ddd6fe", step: 2,
  },
  DELIVERED: {
    label: "Delivered", icon: "✅",
    color: "#10b981", bg: "#ecfdf5", border: "#a7f3d0", step: 3,
  },
  DECLINED: {
    label: "Declined", icon: "❌",
    color: "#ef4444", bg: "#fef2f2", border: "#fecaca", step: -1,
  },
  CANCELLED: {
    label: "Cancelled", icon: "🚫",
    color: "#6b7280", bg: "#f9fafb", border: "#e5e7eb", step: -1,
  },
};

const STEPS = ["Order Placed", "Preparing", "Out for Delivery", "Delivered"];

/* ─── Progress Stepper ───────────────────────────────────────── */
function ProgressStepper({ status }) {
  const step = STATUS_CONFIG[status]?.step ?? 0;
  if (["DECLINED", "CANCELLED"].includes(status)) return null;

  return (
    <div style={{ margin: "18px 0 6px", position: "relative" }}>
      {/* Track background */}
      <div style={{
        position: "absolute", top: "14px", left: "14px", right: "14px",
        height: "4px", background: "#e5e7eb", borderRadius: "4px", zIndex: 0,
      }} />
      {/* Track fill */}
      <div style={{
        position: "absolute", top: "14px", left: "14px", height: "4px",
        width: step === 0 ? "0%" : step === 1 ? "33%" : step === 2 ? "66%" : "calc(100% - 28px)",
        background: "linear-gradient(90deg, #ff6b00, #ff9f45)",
        borderRadius: "4px", zIndex: 1, transition: "width 0.6s ease",
      }} />
      {/* Steps */}
      <div style={{ display: "flex", justifyContent: "space-between", position: "relative", zIndex: 2 }}>
        {STEPS.map((label, idx) => {
          const done = idx <= step;
          return (
            <div key={idx} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "6px", flex: 1 }}>
              <div style={{
                width: "30px", height: "30px", borderRadius: "50%",
                background: done ? "linear-gradient(135deg, #ff6b00, #ff9f45)" : "#e5e7eb",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: "13px", fontWeight: 700,
                color: done ? "white" : "#9ca3af",
                boxShadow: done ? "0 2px 8px rgba(255,107,0,0.35)" : "none",
                transition: "all 0.4s ease",
              }}>
                {done ? "✓" : idx + 1}
              </div>
              <span style={{
                fontSize: "10px",
                fontWeight: idx === step ? 700 : 400,
                color: idx === step ? "#ff6b00" : idx < step ? "#6b7280" : "#d1d5db",
                textAlign: "center", lineHeight: 1.3, maxWidth: "70px",
              }}>
                {label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ─── Status Badge ───────────────────────────────────────────── */
function StatusBadge({ status }) {
  const cfg = STATUS_CONFIG[status] || STATUS_CONFIG.PLACED;
  return (
    <span style={{
      display: "inline-flex", alignItems: "center", gap: "5px",
      padding: "4px 12px", borderRadius: "20px",
      fontSize: "12px", fontWeight: 700, letterSpacing: "0.3px",
      background: cfg.bg, color: cfg.color, border: `1px solid ${cfg.border}`,
    }}>
      {cfg.icon} {cfg.label}
    </span>
  );
}

/* ─── Order Card ─────────────────────────────────────────────── */
function OrderCard({ order, onDeliver, onCancel, isActive }) {
  const cfg = STATUS_CONFIG[order.status] || STATUS_CONFIG.PLACED;
  const restaurant = order.items?.[0]?.dish?.restaurant;
  const total = order.items?.reduce((sum, i) => sum + i.dish.price * i.quantity, 0) || 0;

  const [confirmCancel, setConfirmCancel] = useState(false);
  const [cancelling, setCancelling] = useState(false);

  // Only PLACED and PREPARING can be cancelled — once SHIPPED the restaurant is on the way
  const canCancel = ["PLACED", "PREPARING"].includes(order.status);

  const dateStr = order.createdAt
    ? new Date(order.createdAt).toLocaleString("en-IN", {
        day: "numeric", month: "short", year: "numeric",
        hour: "2-digit", minute: "2-digit",
      })
    : "—";

  const handleCancelConfirm = async () => {
    setCancelling(true);
    try {
      await onCancel(order.id);
    } finally {
      setCancelling(false);
      setConfirmCancel(false);
    }
  };

  return (
    <div style={{
      background: "white", borderRadius: "16px",
      boxShadow: isActive ? "0 6px 24px rgba(255,107,0,0.12)" : "0 2px 10px rgba(0,0,0,0.06)",
      border: isActive ? `2px solid ${cfg.border}` : "2px solid #f3f4f6",
      overflow: "hidden",
      transition: "transform 0.2s, box-shadow 0.2s",
      marginBottom: "20px",
    }}
    onMouseEnter={e => e.currentTarget.style.transform = "translateY(-3px)"}
    onMouseLeave={e => e.currentTarget.style.transform = "translateY(0)"}
    >
      {/* ── Card Header ── */}
      <div style={{
        padding: "16px 20px",
        background: isActive ? cfg.bg : "#fafafa",
        borderBottom: `1px solid ${isActive ? cfg.border : "#f0f0f0"}`,
        display: "flex", justifyContent: "space-between", alignItems: "center",
        flexWrap: "wrap", gap: "8px",
      }}>
        <div>
          <span style={{ fontSize: "13px", color: "#9ca3af", fontWeight: 500 }}>Order</span>
          <span style={{ marginLeft: "6px", fontSize: "15px", fontWeight: 700, color: "#1f2937" }}>
            #{order.id}
          </span>
        </div>
        <StatusBadge status={order.status} />
      </div>

      {/* ── Card Body ── */}
      <div style={{ padding: "18px 20px" }}>

        {/* Restaurant */}
        {restaurant && (
          <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "14px" }}>
            <span style={{ fontSize: "22px" }}>🏪</span>
            <div>
              <div style={{ fontWeight: 700, fontSize: "15px", color: "#1f2937" }}>{restaurant.name}</div>
              <div style={{ fontSize: "12px", color: "#9ca3af" }}>📍 {restaurant.city}</div>
            </div>
          </div>
        )}

        {/* Items */}
        <div style={{ background: "#f9fafb", borderRadius: "10px", padding: "12px 14px", marginBottom: "14px" }}>
          <div style={{ fontSize: "12px", fontWeight: 600, color: "#6b7280", marginBottom: "8px", textTransform: "uppercase", letterSpacing: "0.5px" }}>
            Items Ordered
          </div>
          {order.items?.map(item => (
            <div key={item.id} style={{
              display: "flex", justifyContent: "space-between",
              fontSize: "14px", padding: "5px 0",
              borderBottom: "1px dashed #e5e7eb", color: "#374151",
            }}>
              <span>🍽️ {item.dish.name}{item.quantity > 1 && <span style={{ color: "#9ca3af" }}> × {item.quantity}</span>}</span>
              <span style={{ fontWeight: 600 }}>₹{(item.dish.price * item.quantity).toFixed(2)}</span>
            </div>
          ))}
          <div style={{ display: "flex", justifyContent: "space-between", marginTop: "8px", fontWeight: 700, fontSize: "14px", color: "#1f2937" }}>
            <span>Total</span>
            <span style={{ color: "#ff6b00" }}>₹{total.toFixed(2)}</span>
          </div>
        </div>

        {/* Date */}
        <div style={{ fontSize: "12px", color: "#9ca3af", marginBottom: isActive ? "4px" : 0 }}>
          🕐 Ordered on {dateStr}
        </div>

        {/* Progress Stepper — active non-declined/cancelled orders only */}
        {isActive && !["DECLINED", "CANCELLED"].includes(order.status) && (
          <ProgressStepper status={order.status} />
        )}

        {/* ── Cancel trigger button (PLACED / PREPARING only) ── */}
        {canCancel && !confirmCancel && (
          <button
            onClick={() => setConfirmCancel(true)}
            style={{
              marginTop: "14px", width: "100%", padding: "10px",
              background: "none", border: "1.5px solid #fecaca",
              borderRadius: "10px", color: "#ef4444",
              cursor: "pointer", fontWeight: 700, fontSize: "13px",
              transition: "all 0.2s",
            }}
            onMouseEnter={e => { e.currentTarget.style.background = "#fef2f2"; e.currentTarget.style.borderColor = "#ef4444"; }}
            onMouseLeave={e => { e.currentTarget.style.background = "none"; e.currentTarget.style.borderColor = "#fecaca"; }}
          >
            🚫 Cancel Order
          </button>
        )}

        {/* ── Cancel confirmation strip ── */}
        {canCancel && confirmCancel && (
          <div style={{
            marginTop: "14px",
            background: "#fef2f2", border: "1px solid #fecaca",
            borderRadius: "10px", padding: "12px 14px",
            display: "flex", alignItems: "center", justifyContent: "space-between",
            flexWrap: "wrap", gap: "10px",
            animation: "fadeIn 0.2s ease",
          }}>
            <div>
              <div style={{ fontWeight: 700, fontSize: "13px", color: "#dc2626" }}>Cancel this order?</div>
              <div style={{ fontSize: "12px", color: "#9ca3af", marginTop: "2px" }}>This cannot be undone.</div>
            </div>
            <div style={{ display: "flex", gap: "8px" }}>
              <button
                onClick={handleCancelConfirm}
                disabled={cancelling}
                style={{
                  padding: "8px 16px",
                  background: cancelling ? "#e5e7eb" : "linear-gradient(135deg, #ef4444, #dc2626)",
                  color: cancelling ? "#9ca3af" : "white",
                  border: "none", borderRadius: "8px",
                  cursor: cancelling ? "not-allowed" : "pointer",
                  fontWeight: 700, fontSize: "12px",
                  boxShadow: cancelling ? "none" : "0 2px 8px rgba(239,68,68,0.3)",
                }}
              >
                {cancelling ? "Cancelling..." : "Yes, Cancel"}
              </button>
              <button
                onClick={() => setConfirmCancel(false)}
                disabled={cancelling}
                style={{
                  padding: "8px 14px", background: "white",
                  border: "1px solid #e5e7eb", borderRadius: "8px",
                  cursor: "pointer", fontWeight: 600, fontSize: "12px", color: "#374151",
                }}
              >
                Keep Order
              </button>
            </div>
          </div>
        )}

        {/* ── Mark as Delivered (SHIPPED) ── */}
        {order.status === "SHIPPED" && (
          <button
            onClick={() => onDeliver(order.id)}
            style={{
              marginTop: "16px", width: "100%", padding: "12px",
              background: "linear-gradient(135deg, #10b981, #059669)",
              color: "white", border: "none", borderRadius: "10px",
              cursor: "pointer", fontWeight: 700, fontSize: "14px",
              boxShadow: "0 4px 12px rgba(16,185,129,0.3)",
              transition: "opacity 0.2s",
            }}
            onMouseEnter={e => e.currentTarget.style.opacity = "0.88"}
            onMouseLeave={e => e.currentTarget.style.opacity = "1"}
          >
            ✅ Mark as Delivered
          </button>
        )}
      </div>
    </div>
  );
}

/* ─── Main Component ─────────────────────────────────────────── */
function OrderHistory() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = () => {
    return axios.get(`/api/orders/user/${user.id}`)
      .then(res => { setOrders(res.data); setLoading(false); })
      .catch(err => { console.error(err); setLoading(false); });
  };

  useEffect(() => { fetchOrders(); }, [user.id]);

  const handleDeliver = async (orderId) => {
    try {
      await axios.put(`/api/orders/status/${orderId}/DELIVER`);
      // Optimistic update
      setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: "DELIVERED" } : o));
    } catch (err) {
      console.error(err);
      fetchOrders(); // re-sync on error
    }
  };

  const handleCancel = async (orderId) => {
    try {
      await axios.put(`/api/orders/status/${orderId}/CANCEL`);
      // Optimistic update — immediately moves card from Active → History
      setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: "CANCELLED" } : o));
    } catch (err) {
      console.error("Cancel failed:", err);
      fetchOrders(); // re-sync on error
    }
  };

  const activeOrders   = orders.filter(o => !["DELIVERED", "DECLINED", "CANCELLED"].includes(o.status));
  const previousOrders = orders.filter(o =>  ["DELIVERED", "DECLINED", "CANCELLED"].includes(o.status));

  if (loading) return (
    <div className="page" style={{ textAlign: "center", paddingTop: "80px" }}>
      <div style={{ fontSize: "40px", marginBottom: "16px" }}>🍽️</div>
      <p style={{ color: "#9ca3af", fontSize: "16px" }}>Fetching your orders...</p>
    </div>
  );

  return (
    <div className="page">

      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "32px", flexWrap: "wrap", gap: "12px" }}>
        <div>
          <h1 style={{ margin: 0, fontSize: "28px", fontWeight: 700, color: "#1f2937" }}>
            📦 My Orders
          </h1>
          <p style={{ margin: "4px 0 0", color: "#9ca3af", fontSize: "14px" }}>
            {orders.length} order{orders.length !== 1 ? "s" : ""} total
          </p>
        </div>
        <button
          className="btn btn-primary"
          onClick={() => navigate("/customer")}
          style={{ borderRadius: "10px", padding: "10px 18px" }}
        >
          ← Back to Restaurants
        </button>
      </div>

      {orders.length === 0 ? (
        <div style={{ textAlign: "center", padding: "80px 20px" }}>
          <div style={{ fontSize: "64px", marginBottom: "16px" }}>🛍️</div>
          <h2 style={{ color: "#1f2937", marginBottom: "8px" }}>No orders yet</h2>
          <p style={{ color: "#9ca3af", marginBottom: "24px" }}>Explore restaurants and order your favourite food!</p>
          <button className="btn btn-primary" onClick={() => navigate("/customer")}
            style={{ borderRadius: "10px", padding: "12px 24px", fontSize: "15px" }}>
            Browse Restaurants 🍕
          </button>
        </div>
      ) : (
        <>
          {/* ── Active Orders ── */}
          {activeOrders.length > 0 && (
            <section style={{ marginBottom: "40px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "18px" }}>
                <span style={{
                  display: "inline-block", width: "10px", height: "10px",
                  borderRadius: "50%", background: "#ff6b00",
                  boxShadow: "0 0 0 3px rgba(255,107,0,0.2)",
                  animation: "pulse 1.8s infinite",
                }} />
                <h2 style={{ margin: 0, fontSize: "20px", fontWeight: 700, color: "#1f2937" }}>
                  Active Orders
                </h2>
                <span style={{
                  background: "#ff6b00", color: "white",
                  borderRadius: "20px", padding: "2px 10px",
                  fontSize: "12px", fontWeight: 700,
                }}>
                  {activeOrders.length}
                </span>
              </div>

              {activeOrders.map(order => (
                <OrderCard key={order.id} order={order} onDeliver={handleDeliver} onCancel={handleCancel} isActive={true} />
              ))}
            </section>
          )}

          {/* ── Previous Orders ── */}
          {previousOrders.length > 0 && (
            <section>
              <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "18px" }}>
                <h2 style={{ margin: 0, fontSize: "20px", fontWeight: 700, color: "#6b7280" }}>
                  Order History
                </h2>
                <span style={{
                  background: "#e5e7eb", color: "#6b7280",
                  borderRadius: "20px", padding: "2px 10px",
                  fontSize: "12px", fontWeight: 700,
                }}>
                  {previousOrders.length}
                </span>
              </div>

              {previousOrders.map(order => (
                <OrderCard key={order.id} order={order} onDeliver={handleDeliver} onCancel={handleCancel} isActive={false} />
              ))}
            </section>
          )}
        </>
      )}

      <style>{`
        @keyframes pulse {
          0%, 100% { box-shadow: 0 0 0 3px rgba(255,107,0,0.2); }
          50%       { box-shadow: 0 0 0 6px rgba(255,107,0,0.08); }
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-4px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}

export default OrderHistory;