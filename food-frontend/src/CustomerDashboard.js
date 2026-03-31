import { useEffect, useState, useCallback } from "react";
import axios from "./axiosConfig";
import { useNavigate, Link } from "react-router-dom";

function CustomerDashboard() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));

  const [restaurants, setRestaurants] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState(null); // null = not searched yet
  const [searching, setSearching] = useState(false);

  const logout = () => {
    localStorage.removeItem("user");
    navigate("/");
  };

  // Load all restaurants on mount
  useEffect(() => {
    axios.get("/api/restaurants/all").then((res) => {
      setRestaurants(res.data);
    });
  }, []);

  // Search handler — groups dishes by restaurant
  const handleSearch = useCallback(async (query) => {
    const q = query.trim();
    if (!q) {
      setSearchResults(null);
      return;
    }

    setSearching(true);
    try {
      const res = await axios.get(`/api/dishes/search?name=${encodeURIComponent(q)}`);
      const dishes = res.data;

      // Group matching dishes by restaurant
      const restaurantMap = {};
      dishes.forEach((dish) => {
        const r = dish.restaurant;
        if (!restaurantMap[r.id]) {
          restaurantMap[r.id] = { restaurant: r, matchingDishes: [] };
        }
        restaurantMap[r.id].matchingDishes.push(dish);
      });

      setSearchResults(Object.values(restaurantMap));
    } catch (err) {
      console.error(err);
    } finally {
      setSearching(false);
    }
  }, []);

  // Debounce search as user types
  useEffect(() => {
    const timer = setTimeout(() => {
      handleSearch(searchQuery);
    }, 400);
    return () => clearTimeout(timer);
  }, [searchQuery, handleSearch]);

  const isSearchMode = searchQuery.trim().length > 0;

  return (
    <div className="page">

      {/* ── Header ── */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "28px", flexWrap: "wrap", gap: "12px" }}>
        <h1 className="page-title" style={{ margin: 0 }}>
          👋 Welcome, {user?.name?.split(" ")[0] || "Customer"}!
        </h1>

        <div style={{ display: "flex", gap: "8px" }}>
          <Link to="/cart">
            <button className="btn btn-primary">🛒 Cart</button>
          </Link>
          <Link to="/orders">
            <button className="btn btn-success">📜 My Orders</button>
          </Link>
          <button className="btn btn-danger" onClick={logout}>Logout</button>
        </div>
      </div>

      {/* ── Search Bar ── */}
      <div style={{
        background: "white",
        borderRadius: "16px",
        boxShadow: "0 4px 20px rgba(0,0,0,0.10)",
        padding: "20px 24px",
        marginBottom: "32px",
        display: "flex",
        alignItems: "center",
        gap: "14px"
      }}>
        <span style={{ fontSize: "22px" }}>🔍</span>
        <input
          type="text"
          placeholder="Search for a food item (e.g. Biryani, Pizza, Burger...)"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          style={{
            flex: 1,
            border: "none",
            outline: "none",
            fontSize: "16px",
            background: "transparent",
            color: "#333"
          }}
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery("")}
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              fontSize: "18px",
              color: "#999",
              lineHeight: 1
            }}
            title="Clear search"
          >
            ✕
          </button>
        )}
      </div>

      {/* ── Search Results Mode ── */}
      {isSearchMode && (
        <>
          <h2 style={{ marginBottom: "16px", fontSize: "20px", color: "#444" }}>
            {searching
              ? "Searching..."
              : searchResults && searchResults.length > 0
              ? `${searchResults.length} restaurant${searchResults.length > 1 ? "s" : ""} found for "${searchQuery}"`
              : `No restaurants found for "${searchQuery}"`}
          </h2>

          {!searching && searchResults && searchResults.length > 0 && (
            <div style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
              gap: "20px"
            }}>
              {searchResults.map(({ restaurant, matchingDishes }) => (
                <div key={restaurant.id} className="card" style={{ borderLeft: "4px solid #ff6b00" }}>

                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "12px" }}>
                    <div>
                      <h3 style={{ margin: "0 0 4px 0" }}>{restaurant.name}</h3>
                      <p style={{ color: "#888", margin: 0, fontSize: "13px" }}>📍 {restaurant.city}</p>
                    </div>
                    <span style={{
                      background: "#fff3e0",
                      color: "#ff6b00",
                      borderRadius: "20px",
                      padding: "3px 10px",
                      fontSize: "12px",
                      fontWeight: 600,
                      whiteSpace: "nowrap"
                    }}>
                      {matchingDishes.length} match{matchingDishes.length > 1 ? "es" : ""}
                    </span>
                  </div>

                  {/* Matching dishes */}
                  <div style={{ marginBottom: "14px" }}>
                    {matchingDishes.map((dish) => (
                      <div key={dish.id} style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        padding: "6px 10px",
                        background: "#fff8f4",
                        borderRadius: "8px",
                        marginBottom: "6px",
                        fontSize: "14px"
                      }}>
                        <span>🍽️ <strong>{dish.name}</strong></span>
                        <span style={{ color: "#ff6b00", fontWeight: 600 }}>₹{dish.price}</span>
                      </div>
                    ))}
                  </div>

                  <Link to={`/menu/${restaurant.id}`}>
                    <button className="btn btn-primary" style={{ width: "100%" }}>
                      View Full Menu →
                    </button>
                  </Link>
                </div>
              ))}
            </div>
          )}
        </>
      )}

      {/* ── All Restaurants Mode (default) ── */}
      {!isSearchMode && (
        <>
          <h2 style={{ marginBottom: "20px", fontSize: "20px", color: "#444" }}>
            🏪 All Restaurants ({restaurants.length})
          </h2>

          {restaurants.length === 0 ? (
            <div className="card">
              <p style={{ color: "#888", textAlign: "center" }}>No restaurants available yet.</p>
            </div>
          ) : (
            <div style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
              gap: "20px"
            }}>
              {restaurants.map((r) => (
                <div key={r.id} className="card">
                  <h3 style={{ margin: "0 0 6px 0" }}>{r.name}</h3>
                  <p style={{ color: "#888", margin: "0 0 4px 0", fontSize: "13px" }}>📍 {r.city}</p>
                  {r.description && (
                    <p style={{ color: "#666", fontSize: "13px", margin: "0 0 14px 0" }}>
                      {r.description}
                    </p>
                  )}

                  <Link to={`/menu/${r.id}`}>
                    <button className="btn btn-primary" style={{ width: "100%" }}>
                      View Menu →
                    </button>
                  </Link>
                </div>
              ))}
            </div>
          )}
        </>
      )}

    </div>
  );
}

export default CustomerDashboard;
