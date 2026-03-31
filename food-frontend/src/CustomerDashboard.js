import { useEffect, useState, useCallback, useRef } from "react";
import axios from "./axiosConfig";
import { useNavigate, Link } from "react-router-dom";

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
    }}>
      {count > 99 ? "99+" : count}
    </span>
  );
}

/* ── Restaurant card colour palette (cycles) ── */
const CARD_GRADIENTS = [
  ["#fff8f0", "#ffe5cc"],
  ["#f0f7ff", "#d6eaff"],
  ["#f0fff8", "#ccf2e0"],
  ["#fdf0ff", "#f0ccff"],
  ["#fff0f0", "#ffd6d6"],
  ["#f0fcff", "#ccf0fc"],
];

const RESTAURANT_EMOJIS = ["🍕", "🍛", "🍔", "🌮", "🍣", "🍜", "🥗", "🍤"];

function CustomerDashboard() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));

  const [restaurants, setRestaurants] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState(null);
  const [searching, setSearching] = useState(false);
  const [searchFocused, setSearchFocused] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const [activeOrderCount, setActiveOrderCount] = useState(0);
  const pollRef = useRef(null);

  const logout = () => {
    localStorage.removeItem("user");
    navigate("/");
  };

  /* Fetch badge counts */
  const fetchBadges = useCallback(() => {
    if (!user?.id) return;
    // Cart count
    axios.get(`/api/cart/${user.id}`)
      .then(res => setCartCount(res.data.length))
      .catch(() => {});
    // Active orders (PLACED / PREPARING / SHIPPED)
    axios.get(`/api/orders/user/${user.id}`)
      .then(res => {
        const active = res.data.filter(o => !["DELIVERED", "DECLINED"].includes(o.status));
        setActiveOrderCount(active.length);
      })
      .catch(() => {});
  }, [user?.id]);

  useEffect(() => {
    axios.get("/api/restaurants/all").then((res) => setRestaurants(res.data));
    fetchBadges();
    // Poll every 30 s
    pollRef.current = setInterval(fetchBadges, 30000);
    return () => clearInterval(pollRef.current);
  }, [fetchBadges]);

  const handleSearch = useCallback(async (query) => {
    const q = query.trim();
    if (!q) { setSearchResults(null); return; }
    setSearching(true);
    try {
      const res = await axios.get(`/api/dishes/search?name=${encodeURIComponent(q)}`);
      const restaurantMap = {};
      res.data.forEach((dish) => {
        const r = dish.restaurant;
        if (!restaurantMap[r.id]) restaurantMap[r.id] = { restaurant: r, matchingDishes: [] };
        restaurantMap[r.id].matchingDishes.push(dish);
      });
      setSearchResults(Object.values(restaurantMap));
    } catch (err) {
      console.error(err);
    } finally {
      setSearching(false);
    }
  }, []);

  useEffect(() => {
    const t = setTimeout(() => handleSearch(searchQuery), 400);
    return () => clearTimeout(t);
  }, [searchQuery, handleSearch]);

  const isSearchMode = searchQuery.trim().length > 0;
  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good Morning" : hour < 17 ? "Good Afternoon" : "Good Evening";

  return (
    <div style={{ minHeight: "100vh", background: "#f8f5f2", fontFamily: "'Segoe UI', sans-serif" }}>

      {/* ══════════════════════ NAVBAR ══════════════════════ */}
      <nav style={{
        background: "white",
        boxShadow: "0 2px 16px rgba(0,0,0,0.08)",
        padding: "0 32px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        height: "64px",
        position: "sticky",
        top: 0,
        zIndex: 100,
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <span style={{ fontSize: "26px" }}>🍽️</span>
          <span style={{ fontWeight: 800, fontSize: "20px", color: "#1f2937", letterSpacing: "-0.3px" }}>
            Food<span style={{ color: "#ff6b00" }}>Express</span>
          </span>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          {/* Cart button with badge */}
          <Link to="/cart" style={{ position: "relative", display: "inline-block" }}>
            <button style={{
              background: "#fff8f4", border: "1.5px solid #fde8d4",
              borderRadius: "10px", padding: "8px 16px",
              cursor: "pointer", fontWeight: 600, color: "#ff6b00",
              fontSize: "14px", display: "flex", alignItems: "center", gap: "6px",
              transition: "all 0.2s",
            }}
            onMouseEnter={e => e.currentTarget.style.background = "#fde8d4"}
            onMouseLeave={e => e.currentTarget.style.background = "#fff8f4"}
            >
              🛒 Cart
            </button>
            <NavBadge count={cartCount} color="#ff6b00" />
          </Link>

          {/* My Orders button with badge */}
          <Link to="/orders" style={{ position: "relative", display: "inline-block" }}>
            <button style={{
              background: "#f0fdf4", border: "1.5px solid #bbf7d0",
              borderRadius: "10px", padding: "8px 16px",
              cursor: "pointer", fontWeight: 600, color: "#16a34a",
              fontSize: "14px", display: "flex", alignItems: "center", gap: "6px",
              transition: "all 0.2s",
            }}
            onMouseEnter={e => e.currentTarget.style.background = "#dcfce7"}
            onMouseLeave={e => e.currentTarget.style.background = "#f0fdf4"}
            >
              📦 My Orders
            </button>
            <NavBadge count={activeOrderCount} color="#16a34a" />
          </Link>

          {/* Avatar + logout */}
          <div style={{ position: "relative" }}>
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
              {user?.name?.[0]?.toUpperCase() || "U"}
            </button>
          </div>
        </div>
      </nav>

      {/* ══════════════════════ HERO BANNER ══════════════════════ */}
      <div style={{
        background: "linear-gradient(135deg, #ff6b00 0%, #ff9f45 50%, #ffbe76 100%)",
        padding: "48px 32px 56px",
        position: "relative",
        overflow: "hidden",
      }}>
        {/* Background circles */}
        <div style={{ position: "absolute", top: "-40px", right: "-40px", width: "200px", height: "200px", borderRadius: "50%", background: "rgba(255,255,255,0.08)" }} />
        <div style={{ position: "absolute", bottom: "-60px", left: "10%", width: "160px", height: "160px", borderRadius: "50%", background: "rgba(255,255,255,0.06)" }} />
        <div style={{ position: "absolute", top: "20px", right: "20%", width: "80px", height: "80px", borderRadius: "50%", background: "rgba(255,255,255,0.1)" }} />

        <div style={{ maxWidth: "900px", margin: "0 auto", position: "relative" }}>
          <p style={{ color: "rgba(255,255,255,0.85)", fontSize: "15px", margin: "0 0 6px", fontWeight: 500 }}>
            {greeting}, {user?.name?.split(" ")[0] || "there"} 👋
          </p>
          <h1 style={{ color: "white", fontSize: "36px", fontWeight: 800, margin: "0 0 8px", lineHeight: 1.2, letterSpacing: "-0.5px" }}>
            What are you craving today?
          </h1>
          <p style={{ color: "rgba(255,255,255,0.75)", fontSize: "15px", margin: "0 0 28px" }}>
            Explore {restaurants.length} restaurant{restaurants.length !== 1 ? "s" : ""} near you
          </p>

          {/* ── Big Search Bar ── */}
          <div style={{
            background: "white",
            borderRadius: "16px",
            boxShadow: searchFocused
              ? "0 0 0 4px rgba(255,255,255,0.4), 0 8px 32px rgba(0,0,0,0.15)"
              : "0 8px 32px rgba(0,0,0,0.15)",
            display: "flex",
            alignItems: "center",
            padding: "6px 6px 6px 20px",
            gap: "10px",
            transition: "box-shadow 0.25s",
          }}>
            <span style={{ fontSize: "20px", flexShrink: 0 }}>🔍</span>
            <input
              type="text"
              placeholder="Search dishes — Biryani, Pizza, Burger, Sushi..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => setSearchFocused(true)}
              onBlur={() => setSearchFocused(false)}
              style={{
                flex: 1, border: "none", outline: "none",
                fontSize: "15px", background: "transparent", color: "#1f2937",
                padding: "10px 0",
              }}
            />
            {searchQuery ? (
              <button onClick={() => setSearchQuery("")} style={{
                background: "#f3f4f6", border: "none", borderRadius: "8px",
                width: "32px", height: "32px", cursor: "pointer",
                fontSize: "14px", color: "#6b7280", flexShrink: 0,
              }}>✕</button>
            ) : (
              <button style={{
                background: "linear-gradient(135deg, #ff6b00, #ff9f45)",
                border: "none", borderRadius: "12px",
                padding: "10px 20px", cursor: "pointer",
                color: "white", fontWeight: 700, fontSize: "14px", flexShrink: 0,
              }}>Search</button>
            )}
          </div>
        </div>
      </div>

      {/* ══════════════════════ MAIN CONTENT ══════════════════════ */}
      <div style={{ maxWidth: "960px", margin: "0 auto", padding: "36px 24px" }}>

        {/* ── Quick Stats Strip ── */}
        {!isSearchMode && (
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: "16px",
            marginBottom: "36px",
          }}>
            {[
              { icon: "🏪", label: "Restaurants", value: restaurants.length },
              { icon: "🛒", label: "Go to Cart", value: "View →", link: "/cart" },
              { icon: "📦", label: "My Orders", value: "Track →", link: "/orders" },
            ].map((stat, i) => (
              <div
                key={i}
                onClick={() => stat.link && navigate(stat.link)}
                style={{
                  background: "white",
                  borderRadius: "14px",
                  padding: "18px 20px",
                  boxShadow: "0 2px 10px rgba(0,0,0,0.06)",
                  cursor: stat.link ? "pointer" : "default",
                  display: "flex", alignItems: "center", gap: "14px",
                  transition: "transform 0.2s, box-shadow 0.2s",
                  border: "1px solid #f3f4f6",
                }}
                onMouseEnter={e => { if (stat.link) { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "0 6px 20px rgba(0,0,0,0.10)"; }}}
                onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "0 2px 10px rgba(0,0,0,0.06)"; }}
              >
                <span style={{ fontSize: "28px" }}>{stat.icon}</span>
                <div>
                  <div style={{ fontSize: "12px", color: "#9ca3af", fontWeight: 500 }}>{stat.label}</div>
                  <div style={{ fontSize: "20px", fontWeight: 800, color: "#1f2937" }}>{stat.value}</div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ── SEARCH RESULTS ── */}
        {isSearchMode && (
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "24px" }}>
              <h2 style={{ margin: 0, fontSize: "20px", fontWeight: 700, color: "#1f2937" }}>
                {searching
                  ? "🔍 Searching..."
                  : searchResults?.length > 0
                  ? `Found "${searchQuery}" in ${searchResults.length} restaurant${searchResults.length > 1 ? "s" : ""}`
                  : `No results for "${searchQuery}"`}
              </h2>
              {!searching && searchResults?.length > 0 && (
                <span style={{
                  background: "#fff3ea", color: "#ff6b00",
                  borderRadius: "20px", padding: "3px 12px",
                  fontSize: "12px", fontWeight: 700,
                }}>{searchResults.length} match{searchResults.length > 1 ? "es" : ""}</span>
              )}
            </div>

            {!searching && searchResults?.length === 0 && (
              <div style={{ textAlign: "center", padding: "60px 20px" }}>
                <div style={{ fontSize: "56px", marginBottom: "12px" }}>🍽️</div>
                <h3 style={{ color: "#1f2937", marginBottom: "6px" }}>Nothing found</h3>
                <p style={{ color: "#9ca3af" }}>Try a different dish name or browse all restaurants.</p>
                <button onClick={() => setSearchQuery("")} className="btn btn-primary"
                  style={{ borderRadius: "10px", marginTop: "16px" }}>
                  Browse All Restaurants
                </button>
              </div>
            )}

            {!searching && searchResults?.length > 0 && (
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: "20px" }}>
                {searchResults.map(({ restaurant, matchingDishes }, idx) => {
                  const [bg1, bg2] = CARD_GRADIENTS[idx % CARD_GRADIENTS.length];
                  return (
                    <div key={restaurant.id} style={{
                      background: "white",
                      borderRadius: "18px",
                      boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
                      overflow: "hidden",
                      border: "1px solid #f3f4f6",
                      transition: "transform 0.2s, box-shadow 0.2s",
                    }}
                    onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-4px)"; e.currentTarget.style.boxShadow = "0 10px 30px rgba(0,0,0,0.13)"; }}
                    onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "0 4px 20px rgba(0,0,0,0.08)"; }}
                    >
                      {/* Coloured top banner */}
                      <div style={{
                        background: `linear-gradient(135deg, ${bg1}, ${bg2})`,
                        padding: "20px", display: "flex", justifyContent: "space-between", alignItems: "flex-start",
                      }}>
                        <div>
                          <h3 style={{ margin: "0 0 4px", fontSize: "17px", fontWeight: 700, color: "#1f2937" }}>{restaurant.name}</h3>
                          <p style={{ margin: 0, fontSize: "12px", color: "#6b7280" }}>📍 {restaurant.city}</p>
                        </div>
                        <span style={{
                          background: "white", color: "#ff6b00",
                          borderRadius: "20px", padding: "4px 12px",
                          fontSize: "11px", fontWeight: 700, whiteSpace: "nowrap",
                          boxShadow: "0 1px 4px rgba(0,0,0,0.08)",
                        }}>
                          {matchingDishes.length} match{matchingDishes.length > 1 ? "es" : ""}
                        </span>
                      </div>

                      {/* Matching dishes */}
                      <div style={{ padding: "14px 16px" }}>
                        {matchingDishes.map(dish => (
                          <div key={dish.id} style={{
                            display: "flex", justifyContent: "space-between", alignItems: "center",
                            padding: "8px 12px", background: "#fff8f4",
                            borderRadius: "10px", marginBottom: "6px",
                          }}>
                            <span style={{ fontSize: "13px", fontWeight: 600, color: "#374151" }}>🍽️ {dish.name}</span>
                            <span style={{ fontSize: "13px", fontWeight: 700, color: "#ff6b00" }}>₹{dish.price}</span>
                          </div>
                        ))}

                        <Link to={`/menu/${restaurant.id}`} style={{ textDecoration: "none" }}>
                          <button style={{
                            marginTop: "10px", width: "100%",
                            padding: "11px",
                            background: "linear-gradient(135deg, #ff6b00, #ff9f45)",
                            color: "white", border: "none", borderRadius: "10px",
                            cursor: "pointer", fontWeight: 700, fontSize: "14px",
                            boxShadow: "0 3px 10px rgba(255,107,0,0.25)",
                            transition: "opacity 0.2s",
                          }}
                          onMouseEnter={e => e.currentTarget.style.opacity = "0.88"}
                          onMouseLeave={e => e.currentTarget.style.opacity = "1"}
                          >
                            View Full Menu →
                          </button>
                        </Link>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* ── ALL RESTAURANTS ── */}
        {!isSearchMode && (
          <div>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "20px" }}>
              <h2 style={{ margin: 0, fontSize: "20px", fontWeight: 700, color: "#1f2937" }}>
                🏪 All Restaurants
              </h2>
              <span style={{ color: "#9ca3af", fontSize: "13px" }}>{restaurants.length} available</span>
            </div>

            {restaurants.length === 0 ? (
              <div style={{ textAlign: "center", padding: "60px", color: "#9ca3af" }}>
                <div style={{ fontSize: "48px", marginBottom: "12px" }}>🏗️</div>
                <p>No restaurants yet. Check back soon!</p>
              </div>
            ) : (
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "20px" }}>
                {restaurants.map((r, idx) => {
                  const [bg1, bg2] = CARD_GRADIENTS[idx % CARD_GRADIENTS.length];
                  const emoji = RESTAURANT_EMOJIS[idx % RESTAURANT_EMOJIS.length];
                  return (
                    <div key={r.id} style={{
                      background: "white",
                      borderRadius: "18px",
                      boxShadow: "0 4px 16px rgba(0,0,0,0.07)",
                      overflow: "hidden",
                      border: "1px solid #f3f4f6",
                      transition: "transform 0.2s, box-shadow 0.2s",
                    }}
                    onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-5px)"; e.currentTarget.style.boxShadow = "0 12px 32px rgba(0,0,0,0.12)"; }}
                    onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "0 4px 16px rgba(0,0,0,0.07)"; }}
                    >
                      {/* Top banner */}
                      <div style={{
                        background: `linear-gradient(135deg, ${bg1}, ${bg2})`,
                        height: "90px",
                        display: "flex", alignItems: "center", justifyContent: "center",
                        fontSize: "44px",
                        position: "relative",
                      }}>
                        {emoji}
                        {r.isOpen !== false && (
                          <span style={{
                            position: "absolute", top: "10px", right: "12px",
                            background: "#10b981", color: "white",
                            fontSize: "10px", fontWeight: 700, padding: "2px 8px",
                            borderRadius: "10px", letterSpacing: "0.3px",
                          }}>OPEN</span>
                        )}
                      </div>

                      {/* Card body */}
                      <div style={{ padding: "16px 18px" }}>
                        <h3 style={{ margin: "0 0 4px", fontSize: "16px", fontWeight: 700, color: "#1f2937" }}>
                          {r.name}
                        </h3>
                        <p style={{ margin: "0 0 6px", fontSize: "12px", color: "#9ca3af" }}>
                          📍 {r.city}
                        </p>
                        {r.description && (
                          <p style={{
                            margin: "0 0 14px", fontSize: "13px", color: "#6b7280",
                            lineHeight: 1.5,
                            display: "-webkit-box", WebkitLineClamp: 2,
                            WebkitBoxOrient: "vertical", overflow: "hidden",
                          }}>
                            {r.description}
                          </p>
                        )}

                        <div style={{ display: "flex", gap: "8px", marginBottom: "12px", flexWrap: "wrap" }}>
                          <span style={{ background: "#fff3ea", color: "#ff6b00", borderRadius: "6px", padding: "2px 8px", fontSize: "11px", fontWeight: 600 }}>30–45 min</span>
                          <span style={{ background: "#f0fdf4", color: "#16a34a", borderRadius: "6px", padding: "2px 8px", fontSize: "11px", fontWeight: 600 }}>₹30 delivery</span>
                        </div>

                        <Link to={`/menu/${r.id}`} style={{ textDecoration: "none" }}>
                          <button style={{
                            width: "100%", padding: "11px",
                            background: "linear-gradient(135deg, #ff6b00, #ff9f45)",
                            color: "white", border: "none", borderRadius: "10px",
                            cursor: "pointer", fontWeight: 700, fontSize: "14px",
                            boxShadow: "0 3px 10px rgba(255,107,0,0.25)",
                            transition: "opacity 0.2s",
                          }}
                          onMouseEnter={e => e.currentTarget.style.opacity = "0.88"}
                          onMouseLeave={e => e.currentTarget.style.opacity = "1"}
                          >
                            View Menu →
                          </button>
                        </Link>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>

      <style>{`
        @keyframes badgePop {
          0%   { transform: scale(0); opacity: 0; }
          70%  { transform: scale(1.25); }
          100% { transform: scale(1); opacity: 1; }
        }
      `}</style>
    </div>
  );
}

export default CustomerDashboard;
