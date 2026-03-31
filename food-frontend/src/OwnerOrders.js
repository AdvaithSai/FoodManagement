import { useEffect, useState } from "react";
import axios from "./axiosConfig";
import { useNavigate } from "react-router-dom";

/* ── Status config (owner perspective) ─────────────────────── */
const STATUS_CONFIG = {
  PLACED:    { label: "New Order",        icon: "🔔", color: "#f59e0b", bg: "#fffbeb", border: "#fde68a" },
  PREPARING: { label: "Preparing",        icon: "👨‍🍳", color: "#3b82f6", bg: "#eff6ff", border: "#bfdbfe" },
  SHIPPED:   { label: "Out for Delivery", icon: "🚴", color: "#8b5cf6", bg: "#f5f3ff", border: "#ddd6fe" },
  DELIVERED: { label: "Delivered",        icon: "✅", color: "#10b981", bg: "#ecfdf5", border: "#a7f3d0" },
  DECLINED:  { label: "Declined",         icon: "❌", color: "#ef4444", bg: "#fef2f2", border: "#fecaca" },
};

function StatusBadge({ status }) {
  const cfg = STATUS_CONFIG[status] || STATUS_CONFIG.PLACED;
  return (
    <span style={{
      display: "inline-flex", alignItems: "center", gap: "5px",
      padding: "4px 12px", borderRadius: "20px",
      fontSize: "12px", fontWeight: 700,
      background: cfg.bg, color: cfg.color,
      border: `1px solid ${cfg.border}`,
    }}>
      {cfg.icon} {cfg.label}
    </span>
  );
}

/* ── Owner Order Card ───────────────────────────────────────── */
function OrderCard({ order, onUpdate, isActive }) {
  const [acting, setActing] = useState(false);
  const restaurantName = order.items?.[0]?.dish?.restaurant?.name;
  const total = order.items?.reduce((s, i) => s + i.dish.price * (i.quantity || 1), 0) || 0;
  const dateStr = order.createdAt
    ? new Date(order.createdAt).toLocaleString("en-IN", { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" })
    : "—";

  const act = async (action) => {
    setActing(true);
    await onUpdate(order.id, action);
    setActing(false);
  };

  const cfg = STATUS_CONFIG[order.status] || STATUS_CONFIG.PLACED;

  return (
    <div style={{
      background: "white", borderRadius: "16px",
      boxShadow: isActive ? "0 6px 24px rgba(255,107,0,0.09)" : "0 2px 10px rgba(0,0,0,0.05)",
      border: isActive ? `2px solid ${cfg.border}` : "2px solid #f3f4f6",
      overflow: "hidden",
      transition: "transform 0.2s, box-shadow 0.2s",
      marginBottom: "16px",
    }}
    onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = isActive ? "0 10px 30px rgba(255,107,0,0.12)" : "0 6px 20px rgba(0,0,0,0.08)"; }}
    onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = isActive ? "0 6px 24px rgba(255,107,0,0.09)" : "0 2px 10px rgba(0,0,0,0.05)"; }}
    >
      {/* Card Header */}
      <div style={{
        padding: "14px 20px",
        background: isActive ? cfg.bg : "#fafafa",
        borderBottom: `1px solid ${isActive ? cfg.border : "#f0f0f0"}`,
        display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "8px",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <span style={{ fontSize: "13px", fontWeight: 500, color: "#9ca3af" }}>Order</span>
          <span style={{ fontSize: "16px", fontWeight: 800, color: "#1f2937" }}>#{order.id}</span>
          {restaurantName && (
            <span style={{
              background: "white", borderRadius: "8px", padding: "2px 10px",
              fontSize: "12px", fontWeight: 600, color: "#6b7280",
              border: "1px solid #e5e7eb",
            }}>🏪 {restaurantName}</span>
          )}
        </div>
        <StatusBadge status={order.status} />
      </div>

      {/* Card Body */}
      <div style={{ padding: "16px 20px" }}>
        {/* Items */}
        <div style={{ background: "#f9fafb", borderRadius: "10px", padding: "10px 14px", marginBottom: "12px" }}>
          <div style={{ fontSize: "11px", fontWeight: 700, color: "#9ca3af", marginBottom: "8px", textTransform: "uppercase", letterSpacing: "0.5px" }}>
            Items
          </div>
          {order.items?.map(item => (
            <div key={item.id} style={{
              display: "flex", justifyContent: "space-between",
              fontSize: "13px", padding: "5px 0",
              borderBottom: "1px dashed #e5e7eb", color: "#374151",
            }}>
              <span>🍽️ {item.dish.name}{item.quantity > 1 && <span style={{ color: "#9ca3af" }}> × {item.quantity}</span>}</span>
              <span style={{ fontWeight: 600 }}>₹{item.dish.price}</span>
            </div>
          ))}
          <div style={{ display: "flex", justifyContent: "space-between", marginTop: "8px", fontWeight: 800, fontSize: "14px" }}>
            <span>Total</span>
            <span style={{ color: "#ff6b00" }}>₹{total.toFixed(2)}</span>
          </div>
        </div>

        {/* Date + Customer */}
        <div style={{ fontSize: "12px", color: "#9ca3af", marginBottom: isActive ? "14px" : 0 }}>
          🕐 {dateStr}
        </div>

        {/* Action Buttons */}
        {isActive && (
          <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
            {order.status === "PLACED" && (
              <>
                <button onClick={() => act("ACCEPT")} disabled={acting} style={{
                  flex: 1, padding: "10px",
                  background: acting ? "#e5e7eb" : "linear-gradient(135deg, #10b981, #059669)",
                  color: acting ? "#9ca3af" : "white",
                  border: "none", borderRadius: "10px",
                  cursor: acting ? "not-allowed" : "pointer",
                  fontWeight: 700, fontSize: "13px",
                  boxShadow: acting ? "none" : "0 3px 10px rgba(16,185,129,0.3)",
                  transition: "opacity 0.2s",
                }}
                onMouseEnter={e => { if (!acting) e.currentTarget.style.opacity = "0.88"; }}
                onMouseLeave={e => e.currentTarget.style.opacity = "1"}
                >
                  ✅ Accept Order
                </button>
                <button onClick={() => act("DECLINE")} disabled={acting} style={{
                  padding: "10px 18px",
                  background: "#fef2f2", color: "#ef4444",
                  border: "1px solid #fecaca", borderRadius: "10px",
                  cursor: acting ? "not-allowed" : "pointer",
                  fontWeight: 700, fontSize: "13px",
                  transition: "background 0.2s",
                }}
                onMouseEnter={e => { if (!acting) e.currentTarget.style.background = "#fee2e2"; }}
                onMouseLeave={e => e.currentTarget.style.background = "#fef2f2"}
                >
                  ❌ Decline
                </button>
              </>
            )}
            {order.status === "PREPARING" && (
              <button onClick={() => act("SHIP")} disabled={acting} style={{
                width: "100%", padding: "11px",
                background: acting ? "#e5e7eb" : "linear-gradient(135deg, #8b5cf6, #7c3aed)",
                color: acting ? "#9ca3af" : "white",
                border: "none", borderRadius: "10px",
                cursor: acting ? "not-allowed" : "pointer",
                fontWeight: 700, fontSize: "13px",
                boxShadow: acting ? "none" : "0 3px 10px rgba(139,92,246,0.3)",
              }}>
                🚴 Mark as Shipped
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

/* ── Main ───────────────────────────────────────────────────── */
function OwnerOrders() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = () => {
    axios.get(`http://localhost:8080/api/orders/owner/${user.id}`)
      .then(res => { setOrders(res.data); setLoading(false); })
      .catch(() => setLoading(false));
  };

  useEffect(() => { fetchOrders(); }, [user.id]);

  const updateStatus = async (orderId, action) => {
    await axios.put(`http://localhost:8080/api/orders/status/${orderId}/${action}`);
    setOrders(prev => prev.map(o => {
      if (o.id !== orderId) return o;
      const map = { ACCEPT: "PREPARING", DECLINE: "DECLINED", SHIP: "SHIPPED" };
      return { ...o, status: map[action] || o.status };
    }));
  };

  const activeOrders   = orders.filter(o => !["DELIVERED", "DECLINED"].includes(o.status));
  const previousOrders = orders.filter(o =>  ["DELIVERED", "DECLINED"].includes(o.status));

  // Summary counts
  const counts = {
    PLACED:    orders.filter(o => o.status === "PLACED").length,
    PREPARING: orders.filter(o => o.status === "PREPARING").length,
    SHIPPED:   orders.filter(o => o.status === "SHIPPED").length,
    DELIVERED: orders.filter(o => o.status === "DELIVERED").length,
  };

  return (
    <div style={{ minHeight: "100vh", background: "#f8f5f2", fontFamily: "'Segoe UI', sans-serif" }}>

      {/* ── Navbar ── */}
      <nav style={{
        background: "white", boxShadow: "0 2px 16px rgba(0,0,0,0.08)",
        padding: "0 32px", display: "flex", height: "64px",
        alignItems: "center", justifyContent: "space-between",
        position: "sticky", top: 0, zIndex: 100,
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "10px", cursor: "pointer" }} onClick={() => navigate("/owner")}>
          <span style={{ fontSize: "26px" }}>🍽️</span>
          <span style={{ fontWeight: 800, fontSize: "20px", color: "#1f2937" }}>
            Food<span style={{ color: "#ff6b00" }}>Express</span>
          </span>
          <span style={{ background: "#fff3ea", color: "#ff6b00", borderRadius: "20px", padding: "2px 10px", fontSize: "11px", fontWeight: 700 }}>OWNER</span>
        </div>
        <div style={{ display: "flex", gap: "10px" }}>
          <button onClick={() => navigate("/owner")} style={{
            background: "none", border: "1.5px solid #e5e7eb", borderRadius: "10px",
            padding: "8px 14px", cursor: "pointer", fontWeight: 600, color: "#6b7280", fontSize: "13px",
          }}>← Dashboard</button>
          <button onClick={() => navigate("/owner/analytics")} style={{
            background: "#f0fdf4", border: "1.5px solid #bbf7d0", borderRadius: "10px",
            padding: "8px 16px", cursor: "pointer", fontWeight: 600, color: "#16a34a", fontSize: "13px",
          }}>📊 Analytics</button>
        </div>
      </nav>

      {/* ── Hero ── */}
      <div style={{
        background: "linear-gradient(135deg, #1f2937, #374151)",
        padding: "36px 32px 44px", position: "relative", overflow: "hidden",
      }}>
        <div style={{ position: "absolute", top: "-40px", right: "-40px", width: "200px", height: "200px", borderRadius: "50%", background: "rgba(255,107,0,0.10)" }} />
        <div style={{ maxWidth: "960px", margin: "0 auto", position: "relative" }}>
          <h1 style={{ color: "white", margin: "0 0 6px", fontWeight: 800, fontSize: "28px" }}>📦 Order Management</h1>
          <p style={{ color: "rgba(255,255,255,0.55)", margin: "0 0 28px", fontSize: "14px" }}>
            {orders.length} total order{orders.length !== 1 ? "s" : ""} · {activeOrders.length} active
          </p>

          {/* Status summary tiles */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(130px, 1fr))", gap: "12px" }}>
            {[
              { label: "New Orders",  value: counts.PLACED,    icon: "🔔", col: "#f59e0b" },
              { label: "Preparing",   value: counts.PREPARING,  icon: "👨‍🍳", col: "#3b82f6" },
              { label: "Shipped",     value: counts.SHIPPED,    icon: "🚴", col: "#8b5cf6" },
              { label: "Delivered",   value: counts.DELIVERED,  icon: "✅", col: "#10b981" },
            ].map(s => (
              <div key={s.label} style={{
                background: "rgba(255,255,255,0.10)", border: "1px solid rgba(255,255,255,0.15)",
                borderRadius: "12px", padding: "14px 16px",
                display: "flex", alignItems: "center", gap: "10px",
              }}>
                <span style={{ fontSize: "22px" }}>{s.icon}</span>
                <div>
                  <div style={{ fontSize: "22px", fontWeight: 800, color: "white" }}>{s.value}</div>
                  <div style={{ fontSize: "11px", color: "rgba(255,255,255,0.5)" }}>{s.label}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Content ── */}
      <div style={{ maxWidth: "960px", margin: "0 auto", padding: "32px 24px" }}>

        {loading ? (
          <div style={{ textAlign: "center", padding: "60px", color: "#9ca3af" }}>
            <div style={{ fontSize: "40px", marginBottom: "12px" }}>📦</div>
            <p>Loading orders...</p>
          </div>
        ) : orders.length === 0 ? (
          <div style={{ textAlign: "center", padding: "80px 20px", background: "white", borderRadius: "20px", boxShadow: "0 4px 16px rgba(0,0,0,0.06)" }}>
            <div style={{ fontSize: "60px", marginBottom: "14px" }}>🎉</div>
            <h2 style={{ color: "#1f2937", fontWeight: 800, marginBottom: "8px" }}>No orders yet</h2>
            <p style={{ color: "#9ca3af" }}>When customers place orders, they'll appear here.</p>
          </div>
        ) : (
          <>
            {/* Active Orders */}
            {activeOrders.length > 0 && (
              <section style={{ marginBottom: "40px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "18px" }}>
                  <span style={{
                    display: "inline-block", width: "10px", height: "10px",
                    borderRadius: "50%", background: "#ff6b00",
                    animation: "pulse 1.8s infinite",
                  }} />
                  <h2 style={{ margin: 0, fontSize: "20px", fontWeight: 700, color: "#1f2937" }}>Active Orders</h2>
                  <span style={{ background: "#ff6b00", color: "white", borderRadius: "20px", padding: "2px 10px", fontSize: "12px", fontWeight: 700 }}>
                    {activeOrders.length}
                  </span>
                </div>
                {activeOrders.map(o => <OrderCard key={o.id} order={o} onUpdate={updateStatus} isActive={true} />)}
              </section>
            )}

            {/* Previous Orders */}
            {previousOrders.length > 0 && (
              <section>
                <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "18px" }}>
                  <h2 style={{ margin: 0, fontSize: "20px", fontWeight: 700, color: "#6b7280" }}>Order History</h2>
                  <span style={{ background: "#e5e7eb", color: "#6b7280", borderRadius: "20px", padding: "2px 10px", fontSize: "12px", fontWeight: 700 }}>
                    {previousOrders.length}
                  </span>
                </div>
                {previousOrders.map(o => <OrderCard key={o.id} order={o} onUpdate={updateStatus} isActive={false} />)}
              </section>
            )}
          </>
        )}
      </div>

      <style>{`
        @keyframes pulse {
          0%, 100% { box-shadow: 0 0 0 3px rgba(255,107,0,0.2); }
          50%       { box-shadow: 0 0 0 6px rgba(255,107,0,0.08); }
        }
      `}</style>
    </div>
  );
}

export default OwnerOrders;
