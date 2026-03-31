import { useNavigate } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import axios from "axios";

/* ── Reusable badge bubble ── */
function NavBadge({ count, color = "#ef4444" }) {
  if (!count || count === 0) return null;
  return (
    <span style={{
      position: "absolute", top: "-7px", right: "-7px",
      background: color, color: "white",
      borderRadius: "50%", minWidth: "18px", height: "18px",
      fontSize: "10px", fontWeight: 800,
      display: "flex", alignItems: "center", justifyContent: "center",
      border: "2px solid white",
      padding: "0 3px",
      animation: "badgePop 0.3s ease",
      lineHeight: 1,
      boxShadow: "0 2px 6px rgba(0,0,0,0.20)",
      zIndex: 10,
    }}>
      {count > 99 ? "99+" : count}
    </span>
  );
}

const DISH_EMOJIS = ["🍕", "🍛", "🍔", "🌮", "🍣", "🍜", "🥗", "🍤", "🍗", "🥘", "🍝", "🥙"];
const CARD_GRADIENTS = [
  ["#fff8f0", "#ffe5cc"],
  ["#f0f7ff", "#d6eaff"],
  ["#f0fff8", "#ccf2e0"],
  ["#fdf0ff", "#f0ccff"],
  ["#fff0f0", "#ffd6d6"],
  ["#f0fcff", "#ccf0fc"],
];

/* ─── Add Dish Form ─────────────────────────────────────────── */
function AddDishForm({ restaurantId, onDishAdded }) {
  const [form, setForm] = useState({ name: "", description: "", price: "" });
  const [saving, setSaving] = useState(false);
  const [open, setOpen] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setSaving(true);
    await axios.post(`http://localhost:8080/api/dishes/add/${restaurantId}`, form);
    setForm({ name: "", description: "", price: "" });
    setSaving(false);
    setOpen(false);
    onDishAdded();
  };

  if (!open) return (
    <button
      onClick={() => setOpen(true)}
      style={{
        width: "100%", padding: "10px",
        background: "none",
        border: "2px dashed #fbd5b5",
        borderRadius: "10px",
        color: "#ff6b00", fontWeight: 600, fontSize: "14px",
        cursor: "pointer", transition: "all 0.2s",
        display: "flex", alignItems: "center", justifyContent: "center", gap: "6px",
      }}
      onMouseEnter={e => { e.currentTarget.style.background = "#fff8f4"; e.currentTarget.style.borderColor = "#ff6b00"; }}
      onMouseLeave={e => { e.currentTarget.style.background = "none"; e.currentTarget.style.borderColor = "#fbd5b5"; }}
    >
      ＋ Add Dish
    </button>
  );

  return (
    <form onSubmit={submit} style={{
      background: "#fff8f4", borderRadius: "12px",
      border: "1.5px solid #fde8d4", padding: "16px",
      display: "flex", flexDirection: "column", gap: "10px",
    }}>
      <div style={{ fontWeight: 700, fontSize: "13px", color: "#ff6b00", marginBottom: "2px" }}>New Dish</div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px" }}>
        <input
          placeholder="Dish name *"
          value={form.name}
          required
          onChange={e => setForm({ ...form, name: e.target.value })}
          style={inputStyle}
          onFocus={e => e.target.style.borderColor = "#ff6b00"}
          onBlur={e => e.target.style.borderColor = "#e5e7eb"}
        />
        <input
          placeholder="Price (₹) *"
          type="number"
          value={form.price}
          required
          onChange={e => setForm({ ...form, price: e.target.value })}
          style={inputStyle}
          onFocus={e => e.target.style.borderColor = "#ff6b00"}
          onBlur={e => e.target.style.borderColor = "#e5e7eb"}
        />
      </div>
      <input
        placeholder="Description (optional)"
        value={form.description}
        onChange={e => setForm({ ...form, description: e.target.value })}
        style={{ ...inputStyle, gridColumn: "1 / -1" }}
        onFocus={e => e.target.style.borderColor = "#ff6b00"}
        onBlur={e => e.target.style.borderColor = "#e5e7eb"}
      />
      <div style={{ display: "flex", gap: "8px" }}>
        <button type="submit" disabled={saving} style={{
          flex: 1, padding: "10px",
          background: saving ? "#e5e7eb" : "linear-gradient(135deg, #ff6b00, #ff9f45)",
          color: saving ? "#9ca3af" : "white",
          border: "none", borderRadius: "10px",
          cursor: saving ? "not-allowed" : "pointer",
          fontWeight: 700, fontSize: "13px",
          boxShadow: saving ? "none" : "0 3px 10px rgba(255,107,0,0.25)",
        }}>
          {saving ? "Saving..." : "Save Dish"}
        </button>
        <button type="button" onClick={() => setOpen(false)} style={{
          padding: "10px 16px", background: "white",
          border: "1.5px solid #e5e7eb", borderRadius: "10px",
          cursor: "pointer", fontWeight: 600, color: "#6b7280", fontSize: "13px",
        }}>Cancel</button>
      </div>
    </form>
  );
}

const inputStyle = {
  padding: "10px 12px", border: "1.5px solid #e5e7eb",
  borderRadius: "8px", fontSize: "13px", outline: "none",
  width: "100%", boxSizing: "border-box", color: "#1f2937",
  background: "white", transition: "border-color 0.2s",
};

/* ─── Restaurant Card ───────────────────────────────────────── */
function RestaurantCard({ restaurant, idx, ownerId, onDelete }) {
  const [dishes, setDishes] = useState([]);
  const [deletingId, setDeletingId] = useState(null);
  const [expanded, setExpanded] = useState(true);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const [bg1, bg2] = CARD_GRADIENTS[idx % CARD_GRADIENTS.length];

  const fetchDishes = () => {
    axios.get(`http://localhost:8080/api/dishes/restaurant/${restaurant.id}`)
      .then(res => setDishes(res.data));
  };

  useEffect(() => { fetchDishes(); }, [restaurant.id]);

  const deleteDish = async (dishId) => {
    setDeletingId(dishId);
    await axios.delete(`http://localhost:8080/api/dishes/delete/${dishId}`);
    setDishes(prev => prev.filter(d => d.id !== dishId));
    setDeletingId(null);
  };

  const handleDeleteRestaurant = async () => {
    setDeleting(true);
    try {
      await axios.delete(`http://localhost:8080/api/restaurants/delete/${restaurant.id}/${ownerId}`);
      onDelete();
    } catch (err) {
      console.error(err);
      setDeleting(false);
      setConfirmDelete(false);
    }
  };

  return (
    <div style={{
      background: "white", borderRadius: "20px",
      boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
      border: "1px solid #f3f4f6",
      overflow: "hidden",
      transition: "box-shadow 0.2s",
    }}
    onMouseEnter={e => e.currentTarget.style.boxShadow = "0 8px 30px rgba(0,0,0,0.12)"}
    onMouseLeave={e => e.currentTarget.style.boxShadow = "0 4px 20px rgba(0,0,0,0.08)"}
    >
      {/* Coloured banner */}
      <div style={{
        background: `linear-gradient(135deg, ${bg1}, ${bg2})`,
        padding: "20px 22px",
        display: "flex", justifyContent: "space-between", alignItems: "center",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
          <div style={{
            width: "50px", height: "50px", borderRadius: "14px",
            background: "white",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: "26px",
            boxShadow: "0 2px 10px rgba(0,0,0,0.10)",
          }}>🏪</div>
          <div>
            <h3 style={{ margin: 0, fontSize: "17px", fontWeight: 800, color: "#1f2937" }}>
              {restaurant.name}
            </h3>
            <p style={{ margin: "3px 0 0", fontSize: "12px", color: "#6b7280" }}>
              📍 {restaurant.city}
              {restaurant.address && ` · ${restaurant.address}`}
            </p>
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <span style={{
            background: "white", borderRadius: "20px",
            padding: "4px 12px", fontSize: "12px", fontWeight: 700,
            color: "#ff6b00", boxShadow: "0 1px 4px rgba(0,0,0,0.08)",
          }}>
            {dishes.length} dish{dishes.length !== 1 ? "es" : ""}
          </span>
          {/* Delete restaurant button */}
          <button
            onClick={() => setConfirmDelete(true)}
            style={{
              background: "white", border: "none", borderRadius: "8px",
              width: "32px", height: "32px",
              cursor: "pointer", fontSize: "14px",
              boxShadow: "0 1px 4px rgba(0,0,0,0.08)",
              transition: "background 0.2s",
              display: "flex", alignItems: "center", justifyContent: "center",
            }}
            onMouseEnter={e => e.currentTarget.style.background = "#fee2e2"}
            onMouseLeave={e => e.currentTarget.style.background = "white"}
            title="Delete restaurant"
          >🗑️</button>
          <button
            onClick={() => setExpanded(p => !p)}
            style={{
              background: "white", border: "none", borderRadius: "8px",
              width: "32px", height: "32px",
              cursor: "pointer", fontSize: "14px",
              boxShadow: "0 1px 4px rgba(0,0,0,0.08)",
              transition: "transform 0.25s",
              transform: expanded ? "rotate(180deg)" : "rotate(0deg)",
              display: "flex", alignItems: "center", justifyContent: "center",
            }}
          >▾</button>
        </div>
      </div>

      {/* Delete confirmation bar */}
      {confirmDelete && (
        <div style={{
          padding: "14px 22px",
          background: "#fef2f2",
          borderBottom: "1px solid #fecaca",
          display: "flex", alignItems: "center", justifyContent: "space-between",
          gap: "12px", flexWrap: "wrap",
          animation: "slideDown 0.2s ease",
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <span style={{ fontSize: "18px" }}>⚠️</span>
            <div>
              <div style={{ fontWeight: 700, fontSize: "13px", color: "#dc2626" }}>Delete "{restaurant.name}"?</div>
              <div style={{ fontSize: "12px", color: "#9ca3af" }}>This will permanently remove the restaurant and all its dishes.</div>
            </div>
          </div>
          <div style={{ display: "flex", gap: "8px" }}>
            <button
              onClick={handleDeleteRestaurant}
              disabled={deleting}
              style={{
                padding: "8px 18px",
                background: deleting ? "#e5e7eb" : "linear-gradient(135deg, #ef4444, #dc2626)",
                color: deleting ? "#9ca3af" : "white",
                border: "none", borderRadius: "8px",
                cursor: deleting ? "not-allowed" : "pointer",
                fontWeight: 700, fontSize: "12px",
                boxShadow: deleting ? "none" : "0 2px 8px rgba(239,68,68,0.3)",
              }}
            >
              {deleting ? "Deleting..." : "Yes, Delete"}
            </button>
            <button
              onClick={() => setConfirmDelete(false)}
              disabled={deleting}
              style={{
                padding: "8px 14px",
                background: "white", border: "1px solid #e5e7eb",
                borderRadius: "8px", cursor: "pointer",
                fontWeight: 600, fontSize: "12px", color: "#6b7280",
              }}
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Expandable body */}
      {expanded && (
        <div style={{ padding: "18px 22px", display: "flex", flexDirection: "column", gap: "12px" }}>

          {/* Dishes list */}
          {dishes.length === 0 ? (
            <div style={{
              textAlign: "center", padding: "24px",
              color: "#9ca3af", fontSize: "13px",
              background: "#f9fafb", borderRadius: "10px",
            }}>
              <div style={{ fontSize: "32px", marginBottom: "8px" }}>🍽️</div>
              No dishes yet — add one below!
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              {dishes.map((d, di) => {
                const emoji = DISH_EMOJIS[di % DISH_EMOJIS.length];
                return (
                  <div key={d.id} style={{
                    display: "flex", alignItems: "center", gap: "12px",
                    padding: "10px 14px",
                    background: "#f9fafb",
                    borderRadius: "10px",
                    border: "1px solid #f3f4f6",
                    opacity: deletingId === d.id ? 0.4 : 1,
                    transition: "opacity 0.3s",
                  }}>
                    <span style={{ fontSize: "20px", flexShrink: 0 }}>{emoji}</span>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontWeight: 600, fontSize: "14px", color: "#1f2937", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                        {d.name}
                      </div>
                      {d.description && (
                        <div style={{ fontSize: "11px", color: "#9ca3af", marginTop: "1px", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                          {d.description}
                        </div>
                      )}
                    </div>
                    <span style={{
                      fontWeight: 800, fontSize: "14px", color: "#ff6b00",
                      flexShrink: 0,
                    }}>₹{d.price}</span>
                    <button
                      onClick={() => deleteDish(d.id)}
                      disabled={deletingId === d.id}
                      style={{
                        background: "#fef2f2", border: "1px solid #fecaca",
                        borderRadius: "8px", width: "30px", height: "30px",
                        cursor: "pointer", fontSize: "13px", flexShrink: 0,
                        transition: "background 0.2s",
                      }}
                      onMouseEnter={e => e.currentTarget.style.background = "#fee2e2"}
                      onMouseLeave={e => e.currentTarget.style.background = "#fef2f2"}
                      title="Delete dish"
                    >🗑️</button>
                  </div>
                );
              })}
            </div>
          )}

          {/* Add dish form */}
          <AddDishForm restaurantId={restaurant.id} onDishAdded={fetchDishes} />
        </div>
      )}
    </div>
  );
}

/* ─── Add Restaurant Form ───────────────────────────────────── */
function AddRestaurantForm({ ownerId, onAdded }) {
  const [form, setForm] = useState({ name: "", description: "", address: "", city: "" });
  const [saving, setSaving] = useState(false);
  const [open, setOpen] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setSaving(true);
    await axios.post(`http://localhost:8080/api/restaurants/add/${ownerId}`, form);
    setForm({ name: "", description: "", address: "", city: "" });
    setSaving(false);
    setOpen(false);
    onAdded();
  };

  if (!open) return (
    <button
      onClick={() => setOpen(true)}
      style={{
        width: "100%", padding: "18px",
        background: "none",
        border: "2px dashed #fbd5b5",
        borderRadius: "16px",
        color: "#ff6b00", fontWeight: 700, fontSize: "15px",
        cursor: "pointer", transition: "all 0.2s",
        display: "flex", alignItems: "center", justifyContent: "center", gap: "8px",
      }}
      onMouseEnter={e => { e.currentTarget.style.background = "#fff8f4"; e.currentTarget.style.borderColor = "#ff6b00"; }}
      onMouseLeave={e => { e.currentTarget.style.background = "none"; e.currentTarget.style.borderColor = "#fbd5b5"; }}
    >
      🏪 Add New Restaurant
    </button>
  );

  return (
    <div style={{
      background: "white", borderRadius: "20px",
      boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
      border: "2px solid #fde8d4",
      overflow: "hidden",
    }}>
      <div style={{ background: "linear-gradient(135deg, #fff8f4, #ffe8d4)", padding: "18px 22px", borderBottom: "1px solid #fde8d4" }}>
        <h3 style={{ margin: 0, fontSize: "17px", fontWeight: 800, color: "#1f2937" }}>🏪 Add New Restaurant</h3>
        <p style={{ margin: "4px 0 0", fontSize: "13px", color: "#9ca3af" }}>Fill in the details to list your restaurant</p>
      </div>

      <form onSubmit={submit} style={{ padding: "20px 22px", display: "flex", flexDirection: "column", gap: "14px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
          {[
            { label: "Restaurant Name *", field: "name", placeholder: "e.g. Spice Garden" },
            { label: "City *", field: "city", placeholder: "e.g. Hyderabad" },
          ].map(({ label, field, placeholder }) => (
            <div key={field}>
              <label style={{ fontSize: "12px", fontWeight: 600, color: "#6b7280", display: "block", marginBottom: "6px" }}>{label}</label>
              <input
                placeholder={placeholder}
                value={form[field]}
                required
                onChange={e => setForm({ ...form, [field]: e.target.value })}
                style={inputStyle}
                onFocus={e => e.target.style.borderColor = "#ff6b00"}
                onBlur={e => e.target.style.borderColor = "#e5e7eb"}
              />
            </div>
          ))}
        </div>
        {[
          { label: "Address", field: "address", placeholder: "Street address" },
          { label: "Description", field: "description", placeholder: "Tell customers about your restaurant" },
        ].map(({ label, field, placeholder }) => (
          <div key={field}>
            <label style={{ fontSize: "12px", fontWeight: 600, color: "#6b7280", display: "block", marginBottom: "6px" }}>{label}</label>
            <input
              placeholder={placeholder}
              value={form[field]}
              onChange={e => setForm({ ...form, [field]: e.target.value })}
              style={inputStyle}
              onFocus={e => e.target.style.borderColor = "#ff6b00"}
              onBlur={e => e.target.style.borderColor = "#e5e7eb"}
            />
          </div>
        ))}

        <div style={{ display: "flex", gap: "10px", marginTop: "4px" }}>
          <button type="submit" disabled={saving} style={{
            flex: 1, padding: "13px",
            background: saving ? "#e5e7eb" : "linear-gradient(135deg, #ff6b00, #ff9f45)",
            color: saving ? "#9ca3af" : "white",
            border: "none", borderRadius: "12px",
            cursor: saving ? "not-allowed" : "pointer",
            fontWeight: 700, fontSize: "14px",
            boxShadow: saving ? "none" : "0 4px 14px rgba(255,107,0,0.3)",
          }}>
            {saving ? "Adding..." : "Add Restaurant 🎉"}
          </button>
          <button type="button" onClick={() => setOpen(false)} style={{
            padding: "13px 20px", background: "white",
            border: "1.5px solid #e5e7eb", borderRadius: "12px",
            cursor: "pointer", fontWeight: 600, color: "#6b7280", fontSize: "14px",
          }}>Cancel</button>
        </div>
      </form>
    </div>
  );
}

/* ─── Main Dashboard ────────────────────────────────────────── */
function OwnerDashboard() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));
  const [restaurants, setRestaurants] = useState([]);
  const [newOrderCount, setNewOrderCount] = useState(0);
  const pollRef = useRef(null);

  const logout = () => {
    localStorage.removeItem("user");
    navigate("/login");
  };

  const fetchRestaurants = () => {
    axios.get(`http://localhost:8080/api/restaurants/owner/${user.id}`)
      .then(res => setRestaurants(res.data));
  };

  const fetchBadges = () => {
    axios.get(`http://localhost:8080/api/orders/owner/${user.id}`)
      .then(res => {
        // PLACED = needs immediate attention
        const placed = res.data.filter(o => o.status === "PLACED");
        setNewOrderCount(placed.length);
      })
      .catch(() => {});
  };

  useEffect(() => {
    fetchRestaurants();
    fetchBadges();
    pollRef.current = setInterval(fetchBadges, 20000); // poll every 20s
    return () => clearInterval(pollRef.current);
  }, [user.id]);

  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good Morning" : hour < 17 ? "Good Afternoon" : "Good Evening";

  return (
    <div style={{ minHeight: "100vh", background: "#f8f5f2", fontFamily: "'Segoe UI', sans-serif" }}>

      {/* ══ NAVBAR ══ */}
      <nav style={{
        background: "white", boxShadow: "0 2px 16px rgba(0,0,0,0.08)",
        padding: "0 32px", display: "flex", alignItems: "center",
        justifyContent: "space-between", height: "64px",
        position: "sticky", top: 0, zIndex: 100,
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <span style={{ fontSize: "26px" }}>🍽️</span>
          <span style={{ fontWeight: 800, fontSize: "20px", color: "#1f2937", letterSpacing: "-0.3px" }}>
            Food<span style={{ color: "#ff6b00" }}>Express</span>
          </span>
          <span style={{
            marginLeft: "8px", background: "#fff3ea", color: "#ff6b00",
            borderRadius: "20px", padding: "2px 10px", fontSize: "11px", fontWeight: 700,
          }}>OWNER</span>
        </div>

        <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
          {/* Orders button with new-order badge */}
          <div style={{ position: "relative", display: "inline-block" }}>
            <button onClick={() => navigate("/owner/orders")} style={{
              background: "#eff6ff", border: "1.5px solid #bfdbfe",
              borderRadius: "10px", padding: "8px 16px",
              cursor: "pointer", fontWeight: 600, color: "#3b82f6", fontSize: "13px",
              display: "flex", alignItems: "center", gap: "6px", transition: "all 0.2s",
            }}
            onMouseEnter={e => e.currentTarget.style.background = "#dbeafe"}
            onMouseLeave={e => e.currentTarget.style.background = "#eff6ff"}
            >
              📦 Orders
            </button>
            <NavBadge count={newOrderCount} color="#ef4444" />
          </div>

          <button onClick={() => navigate("/owner/analytics")} style={{
            background: "#f0fdf4", border: "1.5px solid #bbf7d0",
            borderRadius: "10px", padding: "8px 16px",
            cursor: "pointer", fontWeight: 600, color: "#16a34a", fontSize: "13px",
            display: "flex", alignItems: "center", gap: "6px", transition: "all 0.2s",
          }}
          onMouseEnter={e => e.currentTarget.style.background = "#dcfce7"}
          onMouseLeave={e => e.currentTarget.style.background = "#f0fdf4"}
          >
            📊 Analytics
          </button>

          <button
            onClick={logout}
            style={{
              width: "38px", height: "38px", borderRadius: "50%",
              background: "linear-gradient(135deg, #ff6b00, #ff9f45)",
              border: "none", cursor: "pointer",
              display: "flex", alignItems: "center", justifyContent: "center",
              color: "white", fontWeight: 700, fontSize: "15px",
              boxShadow: "0 2px 8px rgba(255,107,0,0.35)",
              transition: "transform 0.2s",
            }}
            title={`Logout (${user?.name})`}
            onMouseEnter={e => e.currentTarget.style.transform = "scale(1.08)"}
            onMouseLeave={e => e.currentTarget.style.transform = "scale(1)"}
          >
            {user?.name?.[0]?.toUpperCase() || "O"}
          </button>
        </div>
      </nav>

      {/* ══ HERO BANNER ══ */}
      <div style={{
        background: "linear-gradient(135deg, #1f2937 0%, #374151 100%)",
        padding: "40px 32px 48px",
        position: "relative", overflow: "hidden",
      }}>
        <div style={{ position: "absolute", top: "-40px", right: "-40px", width: "220px", height: "220px", borderRadius: "50%", background: "rgba(255,107,0,0.10)" }} />
        <div style={{ position: "absolute", bottom: "-60px", left: "8%", width: "180px", height: "180px", borderRadius: "50%", background: "rgba(255,107,0,0.07)" }} />

        <div style={{ maxWidth: "960px", margin: "0 auto", position: "relative" }}>
          <p style={{ color: "rgba(255,255,255,0.6)", fontSize: "14px", margin: "0 0 6px" }}>
            {greeting}, {user?.name?.split(" ")[0]} 👋
          </p>
          <h1 style={{ color: "white", fontSize: "30px", fontWeight: 800, margin: "0 0 28px", letterSpacing: "-0.4px" }}>
            Your Owner Dashboard
          </h1>

          {/* Stats row */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: "14px" }}>
            {[
              { icon: "🏪", value: restaurants.length, label: "Restaurants" },
              { icon: "🍽️", value: restaurants.reduce((s, r) => s, 0), label: "Total Dishes", dynamic: true },
              { icon: "📦", label: "Orders", value: "View →", onClick: () => navigate("/owner/orders") },
              { icon: "📊", label: "Analytics", value: "View →", onClick: () => navigate("/owner/analytics") },
            ].map((stat, i) => (
              <div
                key={i}
                onClick={stat.onClick}
                style={{
                  background: "rgba(255,255,255,0.10)",
                  border: "1px solid rgba(255,255,255,0.15)",
                  borderRadius: "14px", padding: "16px 20px",
                  cursor: stat.onClick ? "pointer" : "default",
                  backdropFilter: "blur(4px)",
                  transition: "background 0.2s",
                  display: "flex", alignItems: "center", gap: "12px",
                }}
                onMouseEnter={e => { if (stat.onClick) e.currentTarget.style.background = "rgba(255,255,255,0.18)"; }}
                onMouseLeave={e => e.currentTarget.style.background = "rgba(255,255,255,0.10)"}
              >
                <span style={{ fontSize: "26px" }}>{stat.icon}</span>
                <div>
                  <div style={{ fontSize: "20px", fontWeight: 800, color: "white" }}>{stat.value}</div>
                  <div style={{ fontSize: "11px", color: "rgba(255,255,255,0.55)", marginTop: "1px" }}>{stat.label}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ══ MAIN CONTENT ══ */}
      <div style={{ maxWidth: "960px", margin: "0 auto", padding: "36px 24px" }}>

        {/* Section header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
          <h2 style={{ margin: 0, fontSize: "20px", fontWeight: 700, color: "#1f2937" }}>
            Your Restaurants
          </h2>
          <span style={{ color: "#9ca3af", fontSize: "13px" }}>
            {restaurants.length} restaurant{restaurants.length !== 1 ? "s" : ""}
          </span>
        </div>

        {/* Restaurants */}
        {restaurants.length === 0 ? (
          <div style={{
            textAlign: "center", padding: "60px 20px",
            background: "white", borderRadius: "20px",
            boxShadow: "0 4px 16px rgba(0,0,0,0.06)",
            marginBottom: "24px",
          }}>
            <div style={{ fontSize: "56px", marginBottom: "12px" }}>🏗️</div>
            <h3 style={{ color: "#1f2937", marginBottom: "6px", fontWeight: 700 }}>No restaurants yet</h3>
            <p style={{ color: "#9ca3af", margin: 0 }}>Add your first restaurant below to get started!</p>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "20px", marginBottom: "24px" }}>
            {restaurants.map((r, idx) => (
              <RestaurantCard key={r.id} restaurant={r} idx={idx} ownerId={user.id} onDelete={fetchRestaurants} />
            ))}
          </div>
        )}

        {/* Add Restaurant */}
        <AddRestaurantForm ownerId={user.id} onAdded={fetchRestaurants} />
      </div>

      <style>{`
        @keyframes badgePop {
          0%   { transform: scale(0); opacity: 0; }
          70%  { transform: scale(1.25); }
          100% { transform: scale(1); opacity: 1; }
        }
        @keyframes slideDown {
          from { opacity: 0; max-height: 0; padding-top: 0; padding-bottom: 0; }
          to   { opacity: 1; max-height: 100px; }
        }
      `}</style>
    </div>
  );
}

export default OwnerDashboard;