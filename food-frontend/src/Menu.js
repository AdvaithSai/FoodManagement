import { useEffect, useState } from "react";
import axios from "./axiosConfig";
import { useParams, useNavigate, Link } from "react-router-dom";

const DISH_EMOJIS = ["🍕", "🍛", "🍔", "🌮", "🍣", "🍜", "🥗", "🍤", "🍗", "🥘", "🍝", "🥙"];

function Menu() {
  const { id } = useParams();
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));

  const [dishes, setDishes] = useState([]);
  const [restaurant, setRestaurant] = useState(null);
  const [loading, setLoading] = useState(true);
  const [addingId, setAddingId] = useState(null);
  const [addedIds, setAddedIds] = useState(new Set());
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    // Fetch dishes for this restaurant
    axios
      .get(`/api/dishes/restaurant/${id}`)
      .then((res) => {
        setDishes(res.data);
        if (res.data.length > 0) setRestaurant(res.data[0].restaurant);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [id]);

  const addToCart = async (dish) => {
    setAddingId(dish.id);
    try {
      await axios.post(`/api/cart/add/${user.id}/${dish.id}`);
      setAddedIds((prev) => new Set([...prev, dish.id]));
      setTimeout(() => {
        setAddedIds((prev) => {
          const next = new Set(prev);
          next.delete(dish.id);
          return next;
        });
      }, 2000);
    } catch (err) {
      console.error(err);
    } finally {
      setAddingId(null);
    }
  };

  const filteredDishes = dishes.filter((d) =>
    d.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (d.description || "").toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return (
    <div style={{ minHeight: "100vh", background: "#f8f5f2", display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", gap: "16px" }}>
      <div style={{ fontSize: "48px" }}>🍽️</div>
      <p style={{ color: "#9ca3af", fontSize: "16px" }}>Loading menu...</p>
    </div>
  );

  return (
    <div style={{ minHeight: "100vh", background: "#f8f5f2", fontFamily: "'Segoe UI', sans-serif" }}>

      {/* ══════════ NAVBAR ══════════ */}
      <nav style={{
        background: "white",
        boxShadow: "0 2px 16px rgba(0,0,0,0.08)",
        padding: "0 32px",
        display: "flex", alignItems: "center", justifyContent: "space-between",
        height: "64px", position: "sticky", top: 0, zIndex: 100,
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "10px", cursor: "pointer" }} onClick={() => navigate("/customer")}>
          <span style={{ fontSize: "26px" }}>🍽️</span>
          <span style={{ fontWeight: 800, fontSize: "20px", color: "#1f2937", letterSpacing: "-0.3px" }}>
            Food<span style={{ color: "#ff6b00" }}>Express</span>
          </span>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <button
            onClick={() => navigate("/customer")}
            style={{
              background: "none", border: "1.5px solid #e5e7eb",
              borderRadius: "10px", padding: "8px 14px",
              cursor: "pointer", fontWeight: 600, color: "#6b7280", fontSize: "13px",
              display: "flex", alignItems: "center", gap: "5px",
              transition: "all 0.2s",
            }}
            onMouseEnter={e => e.currentTarget.style.borderColor = "#d1d5db"}
            onMouseLeave={e => e.currentTarget.style.borderColor = "#e5e7eb"}
          >
            ← Back
          </button>

          <Link to="/cart">
            <button style={{
              background: "linear-gradient(135deg, #ff6b00, #ff9f45)",
              border: "none", borderRadius: "10px", padding: "8px 18px",
              cursor: "pointer", fontWeight: 700, color: "white", fontSize: "14px",
              boxShadow: "0 3px 10px rgba(255,107,0,0.3)",
              display: "flex", alignItems: "center", gap: "6px",
              transition: "opacity 0.2s",
            }}
            onMouseEnter={e => e.currentTarget.style.opacity = "0.88"}
            onMouseLeave={e => e.currentTarget.style.opacity = "1"}
            >
              🛒 View Cart
            </button>
          </Link>
        </div>
      </nav>

      {/* ══════════ RESTAURANT HERO ══════════ */}
      <div style={{
        background: "linear-gradient(135deg, #1f2937 0%, #374151 100%)",
        padding: "40px 32px 48px",
        position: "relative",
        overflow: "hidden",
      }}>
        {/* Decorative circles */}
        <div style={{ position: "absolute", top: "-30px", right: "-30px", width: "180px", height: "180px", borderRadius: "50%", background: "rgba(255,107,0,0.12)" }} />
        <div style={{ position: "absolute", bottom: "-50px", left: "5%", width: "150px", height: "150px", borderRadius: "50%", background: "rgba(255,107,0,0.08)" }} />

        <div style={{ maxWidth: "900px", margin: "0 auto", position: "relative" }}>
          {/* Breadcrumb */}
          <div style={{ fontSize: "13px", color: "rgba(255,255,255,0.5)", marginBottom: "16px", display: "flex", alignItems: "center", gap: "6px" }}>
            <span style={{ cursor: "pointer" }} onClick={() => navigate("/customer")}>Home</span>
            <span>›</span>
            <span style={{ color: "rgba(255,255,255,0.8)" }}>{restaurant?.name || "Restaurant"}</span>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "20px", flexWrap: "wrap" }}>
            {/* Restaurant icon bubble */}
            <div style={{
              width: "72px", height: "72px", borderRadius: "20px",
              background: "linear-gradient(135deg, #ff6b00, #ff9f45)",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: "36px", boxShadow: "0 6px 20px rgba(255,107,0,0.4)",
              flexShrink: 0,
            }}>
              🏪
            </div>

            <div style={{ flex: 1 }}>
              <h1 style={{ margin: "0 0 6px", color: "white", fontWeight: 800, fontSize: "28px", letterSpacing: "-0.3px" }}>
                {restaurant?.name || "Restaurant Menu"}
              </h1>
              <div style={{ display: "flex", alignItems: "center", gap: "14px", flexWrap: "wrap" }}>
                {restaurant?.city && (
                  <span style={{ color: "rgba(255,255,255,0.65)", fontSize: "14px" }}>
                    📍 {restaurant.city}
                  </span>
                )}
                <span style={{ background: "#10b981", color: "white", borderRadius: "20px", padding: "2px 10px", fontSize: "11px", fontWeight: 700 }}>
                  ● OPEN
                </span>
                <span style={{ color: "rgba(255,255,255,0.5)", fontSize: "13px" }}>
                  🕐 30–45 min delivery
                </span>
                <span style={{ color: "rgba(255,255,255,0.5)", fontSize: "13px" }}>
                  🛵 ₹30 delivery fee
                </span>
              </div>
            </div>

            {/* Dish count badge */}
            <div style={{
              background: "rgba(255,255,255,0.12)",
              borderRadius: "14px", padding: "12px 20px",
              textAlign: "center", border: "1px solid rgba(255,255,255,0.15)",
            }}>
              <div style={{ fontSize: "24px", fontWeight: 800, color: "white" }}>{dishes.length}</div>
              <div style={{ fontSize: "11px", color: "rgba(255,255,255,0.55)", fontWeight: 500 }}>DISHES</div>
            </div>
          </div>

          {/* ── Search within menu ── */}
          <div style={{
            background: "rgba(255,255,255,0.1)",
            borderRadius: "12px",
            border: "1px solid rgba(255,255,255,0.15)",
            display: "flex", alignItems: "center", padding: "4px 4px 4px 16px",
            gap: "10px", marginTop: "28px",
            backdropFilter: "blur(4px)",
          }}>
            <span style={{ fontSize: "16px" }}>🔍</span>
            <input
              type="text"
              placeholder="Search dishes in this menu..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                flex: 1, border: "none", outline: "none",
                background: "transparent", color: "white",
                fontSize: "14px", padding: "9px 0",
              }}
            />
            {searchTerm && (
              <button onClick={() => setSearchTerm("")} style={{
                background: "rgba(255,255,255,0.15)", border: "none",
                borderRadius: "8px", width: "30px", height: "30px",
                cursor: "pointer", color: "white", fontSize: "13px",
              }}>✕</button>
            )}
          </div>
        </div>
      </div>

      {/* ══════════ MENU CONTENT ══════════ */}
      <div style={{ maxWidth: "900px", margin: "0 auto", padding: "32px 24px" }}>

        {/* Result heading */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
          <h2 style={{ margin: 0, fontSize: "18px", fontWeight: 700, color: "#1f2937" }}>
            {searchTerm
              ? `${filteredDishes.length} result${filteredDishes.length !== 1 ? "s" : ""} for "${searchTerm}"`
              : `All Dishes (${dishes.length})`}
          </h2>
          {addedIds.size > 0 && (
            <span style={{
              background: "#f0fdf4", color: "#16a34a",
              borderRadius: "20px", padding: "4px 14px",
              fontSize: "13px", fontWeight: 600,
              border: "1px solid #bbf7d0",
              animation: "fadeIn 0.3s ease",
            }}>
              ✅ {addedIds.size} item{addedIds.size > 1 ? "s" : ""} in cart
            </span>
          )}
        </div>

        {/* Empty state */}
        {filteredDishes.length === 0 && (
          <div style={{ textAlign: "center", padding: "70px 20px" }}>
            <div style={{ fontSize: "56px", marginBottom: "12px" }}>🍽️</div>
            <h3 style={{ color: "#1f2937", marginBottom: "6px" }}>
              {searchTerm ? "No dishes found" : "No dishes yet"}
            </h3>
            <p style={{ color: "#9ca3af" }}>
              {searchTerm ? "Try a different search term." : "This restaurant hasn't added dishes yet."}
            </p>
            {searchTerm && (
              <button onClick={() => setSearchTerm("")} style={{
                marginTop: "16px", padding: "10px 22px",
                background: "linear-gradient(135deg,#ff6b00,#ff9f45)",
                color: "white", border: "none", borderRadius: "10px",
                cursor: "pointer", fontWeight: 700,
              }}>Clear Search</button>
            )}
          </div>
        )}

        {/* Dish Grid */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: "20px" }}>
          {filteredDishes.map((dish, idx) => {
            const isAdding = addingId === dish.id;
            const isAdded = addedIds.has(dish.id);
            const emoji = DISH_EMOJIS[idx % DISH_EMOJIS.length];

            return (
              <div
                key={dish.id}
                style={{
                  background: "white",
                  borderRadius: "18px",
                  boxShadow: "0 4px 16px rgba(0,0,0,0.07)",
                  overflow: "hidden",
                  border: isAdded ? "2px solid #bbf7d0" : "2px solid transparent",
                  transition: "transform 0.2s, box-shadow 0.2s, border-color 0.3s",
                  display: "flex", flexDirection: "column",
                }}
                onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-5px)"; e.currentTarget.style.boxShadow = "0 12px 30px rgba(0,0,0,0.11)"; }}
                onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "0 4px 16px rgba(0,0,0,0.07)"; }}
              >
                {/* Dish banner */}
                <div style={{
                  height: "110px",
                  background: isAdded
                    ? "linear-gradient(135deg, #f0fdf4, #dcfce7)"
                    : "linear-gradient(135deg, #fff8f4, #ffe8d4)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: "52px", position: "relative",
                  transition: "background 0.4s",
                }}>
                  {isAdded ? "✅" : emoji}
                  {!dish.available && (
                    <span style={{
                      position: "absolute", top: "10px", right: "10px",
                      background: "#ef4444", color: "white",
                      fontSize: "9px", fontWeight: 700,
                      padding: "2px 8px", borderRadius: "8px",
                    }}>UNAVAILABLE</span>
                  )}
                  {dish.available && (
                    <span style={{
                      position: "absolute", top: "10px", right: "10px",
                      background: "#10b981", color: "white",
                      fontSize: "9px", fontWeight: 700,
                      padding: "2px 8px", borderRadius: "8px",
                    }}>AVAILABLE</span>
                  )}
                </div>

                {/* Dish info */}
                <div style={{ padding: "16px 16px 12px", flex: 1, display: "flex", flexDirection: "column" }}>
                  <h3 style={{ margin: "0 0 5px", fontSize: "16px", fontWeight: 700, color: "#1f2937" }}>
                    {dish.name}
                  </h3>
                  {dish.description && (
                    <p style={{
                      margin: "0 0 12px", fontSize: "13px", color: "#6b7280",
                      lineHeight: 1.5, flex: 1,
                      display: "-webkit-box", WebkitLineClamp: 2,
                      WebkitBoxOrient: "vertical", overflow: "hidden",
                    }}>
                      {dish.description}
                    </p>
                  )}

                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: "auto" }}>
                    <span style={{ fontSize: "20px", fontWeight: 800, color: "#ff6b00" }}>
                      ₹{dish.price}
                    </span>

                    <button
                      onClick={() => addToCart(dish)}
                      disabled={isAdding || !dish.available}
                      style={{
                        padding: "9px 18px",
                        background: isAdded
                          ? "linear-gradient(135deg, #10b981, #059669)"
                          : isAdding
                          ? "#e5e7eb"
                          : !dish.available
                          ? "#e5e7eb"
                          : "linear-gradient(135deg, #ff6b00, #ff9f45)",
                        color: !dish.available ? "#9ca3af" : "white",
                        border: "none", borderRadius: "10px",
                        cursor: !dish.available ? "not-allowed" : "pointer",
                        fontWeight: 700, fontSize: "13px",
                        boxShadow: isAdded
                          ? "0 3px 10px rgba(16,185,129,0.3)"
                          : dish.available
                          ? "0 3px 10px rgba(255,107,0,0.25)"
                          : "none",
                        transition: "all 0.3s",
                        display: "flex", alignItems: "center", gap: "5px",
                        minWidth: "110px", justifyContent: "center",
                      }}
                    >
                      {isAdded ? "✅ Added!" : isAdding ? "Adding..." : "🛒 Add to Cart"}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* ── Floating cart CTA (when items added) ── */}
        {addedIds.size > 0 && (
          <div style={{
            position: "fixed", bottom: "28px", left: "50%",
            transform: "translateX(-50%)",
            background: "linear-gradient(135deg, #1f2937, #374151)",
            color: "white",
            borderRadius: "20px",
            padding: "14px 28px",
            display: "flex", alignItems: "center", gap: "16px",
            boxShadow: "0 8px 32px rgba(0,0,0,0.25)",
            zIndex: 200,
            animation: "slideUp 0.3s ease",
            whiteSpace: "nowrap",
          }}>
            <span style={{ fontSize: "14px" }}>
              🛒 {addedIds.size} item{addedIds.size > 1 ? "s" : ""} added
            </span>
            <Link to="/cart" style={{ textDecoration: "none" }}>
              <button style={{
                background: "linear-gradient(135deg, #ff6b00, #ff9f45)",
                border: "none", borderRadius: "12px",
                padding: "9px 20px", cursor: "pointer",
                color: "white", fontWeight: 700, fontSize: "13px",
                boxShadow: "0 3px 10px rgba(255,107,0,0.4)",
              }}>
                Go to Cart →
              </button>
            </Link>
          </div>
        )}
      </div>

      <style>{`
        @keyframes slideUp {
          from { opacity: 0; transform: translateX(-50%) translateY(20px); }
          to { opacity: 1; transform: translateX(-50%) translateY(0); }
        }
        @keyframes fadeIn {
          from { opacity: 0; } to { opacity: 1; }
        }
        ::placeholder { color: rgba(255,255,255,0.4); }
      `}</style>
    </div>
  );
}

export default Menu;
