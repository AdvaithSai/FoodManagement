import { useNavigate } from "react-router-dom";

const SUPPORT_EMAIL = "22b81a6703.genai24@gmail.com";

const features = [
  { icon: "🔍", title: "Discover Restaurants", desc: "Browse hundreds of restaurants near you and explore diverse cuisines from local favourites to popular chains." },
  { icon: "🛒", title: "Easy Ordering", desc: "Add dishes to your cart in seconds. Review your order, adjust quantities, and place it with one tap." },
  { icon: "📦", title: "Real-time Tracking", desc: "Track every stage of your order — from the kitchen to your door — with live status updates." },
  { icon: "🏪", title: "For Restaurant Owners", desc: "Manage your restaurant, add dishes, accept or decline orders, and view revenue analytics — all in one place." },
  { icon: "📊", title: "Revenue Analytics", desc: "Owners get daily, weekly, and monthly revenue breakdowns with visual charts to grow their business." },
  { icon: "🔒", title: "Secure & Reliable", desc: "Login with your email or use Google Sign-In. Your data and orders are always safe with us." },
];

const steps = [
  { num: "01", title: "Create an Account", desc: "Sign up as a Customer to order food, or as a Restaurant Owner to list your business.", icon: "👤" },
  { num: "02", title: "Browse Restaurants", desc: "Explore all available restaurants or search for a specific dish you're craving.", icon: "🍽️" },
  { num: "03", title: "Add to Cart & Order", desc: "Pick your dishes, review your cart, and place your order in one click.", icon: "🛒" },
  { num: "04", title: "Track & Enjoy", desc: "Watch your order go from Placed → Preparing → Shipped → Delivered!", icon: "🚴" },
];

export default function LandingPage() {
  const navigate = useNavigate();

  return (
    <div style={{ fontFamily: "'Segoe UI', sans-serif", color: "#1f2937", overflowX: "hidden" }}>

      {/* ════════════════ NAVBAR ════════════════ */}
      <nav style={{
        position: "sticky", top: 0, zIndex: 100,
        background: "rgba(255,255,255,0.95)",
        backdropFilter: "blur(10px)",
        borderBottom: "1px solid #f3f4f6",
        padding: "0 40px",
        display: "flex", alignItems: "center", justifyContent: "space-between",
        height: "66px",
        boxShadow: "0 2px 20px rgba(0,0,0,0.06)",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <span style={{ fontSize: "28px" }}>🍽️</span>
          <span style={{ fontWeight: 800, fontSize: "22px", letterSpacing: "-0.4px" }}>
            Food<span style={{ color: "#ff6b00" }}>Express</span>
          </span>
        </div>

        <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
          <button onClick={() => navigate("/login")} style={{
            background: "none", border: "1.5px solid #e5e7eb",
            borderRadius: "10px", padding: "9px 20px",
            cursor: "pointer", fontWeight: 600, color: "#374151", fontSize: "14px",
            transition: "all 0.2s",
          }}
          onMouseEnter={e => { e.currentTarget.style.borderColor = "#ff6b00"; e.currentTarget.style.color = "#ff6b00"; }}
          onMouseLeave={e => { e.currentTarget.style.borderColor = "#e5e7eb"; e.currentTarget.style.color = "#374151"; }}
          >
            Login
          </button>
          <button onClick={() => navigate("/register")} style={{
            background: "linear-gradient(135deg, #ff6b00, #ff9f45)",
            border: "none", borderRadius: "10px", padding: "9px 22px",
            cursor: "pointer", fontWeight: 700, color: "white", fontSize: "14px",
            boxShadow: "0 4px 12px rgba(255,107,0,0.3)",
            transition: "opacity 0.2s",
          }}
          onMouseEnter={e => e.currentTarget.style.opacity = "0.88"}
          onMouseLeave={e => e.currentTarget.style.opacity = "1"}
          >
            Get Started →
          </button>
        </div>
      </nav>

      {/* ════════════════ HERO ════════════════ */}
      <section style={{
        background: "linear-gradient(135deg, #ff6b00 0%, #ff8c38 40%, #ffb347 100%)",
        padding: "90px 40px 110px",
        textAlign: "center",
        position: "relative",
        overflow: "hidden",
      }}>
        {/* Background blobs */}
        {[
          { top: "-80px", left: "-80px", size: "300px", opacity: 0.1 },
          { top: "30px", right: "-60px", size: "220px", opacity: 0.08 },
          { bottom: "-100px", left: "20%", size: "250px", opacity: 0.07 },
        ].map((b, i) => (
          <div key={i} style={{
            position: "absolute",
            top: b.top, bottom: b.bottom, left: b.left, right: b.right,
            width: b.size, height: b.size,
            borderRadius: "50%",
            background: `rgba(255,255,255,${b.opacity})`,
          }} />
        ))}

        <div style={{ position: "relative", maxWidth: "780px", margin: "0 auto" }}>
          <div style={{
            display: "inline-flex", alignItems: "center", gap: "8px",
            background: "rgba(255,255,255,0.2)", borderRadius: "30px",
            padding: "6px 18px", marginBottom: "24px",
            border: "1px solid rgba(255,255,255,0.3)",
          }}>
            <span>🚀</span>
            <span style={{ color: "white", fontSize: "13px", fontWeight: 600 }}>
              India's fastest food ordering platform
            </span>
          </div>

          <h1 style={{
            fontSize: "clamp(36px, 6vw, 64px)",
            fontWeight: 900, color: "white",
            margin: "0 0 20px", lineHeight: 1.1, letterSpacing: "-1px",
          }}>
            Delicious Food,<br />Delivered Fast 🍕
          </h1>

          <p style={{
            color: "rgba(255,255,255,0.85)", fontSize: "18px",
            maxWidth: "540px", margin: "0 auto 40px", lineHeight: 1.7,
          }}>
            Order from your favourite local restaurants, track in real‑time, and enjoy every bite — from the kitchen to your door.
          </p>

          <div style={{ display: "flex", gap: "14px", justifyContent: "center", flexWrap: "wrap" }}>
            <button onClick={() => navigate("/register")} style={{
              padding: "16px 36px",
              background: "white",
              color: "#ff6b00",
              border: "none", borderRadius: "14px",
              cursor: "pointer", fontWeight: 800, fontSize: "16px",
              boxShadow: "0 8px 24px rgba(0,0,0,0.2)",
              transition: "transform 0.2s, box-shadow 0.2s",
            }}
            onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-3px)"; e.currentTarget.style.boxShadow = "0 12px 32px rgba(0,0,0,0.25)"; }}
            onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "0 8px 24px rgba(0,0,0,0.2)"; }}
            >
              🍽️ Order Now — It's Free
            </button>
            <button onClick={() => navigate("/login")} style={{
              padding: "16px 36px",
              background: "rgba(255,255,255,0.15)",
              color: "white",
              border: "2px solid rgba(255,255,255,0.4)",
              borderRadius: "14px",
              cursor: "pointer", fontWeight: 700, fontSize: "16px",
              transition: "background 0.2s",
            }}
            onMouseEnter={e => e.currentTarget.style.background = "rgba(255,255,255,0.25)"}
            onMouseLeave={e => e.currentTarget.style.background = "rgba(255,255,255,0.15)"}
            >
              Login →
            </button>
          </div>

          {/* Trust strip */}
          <div style={{ display: "flex", gap: "32px", justifyContent: "center", marginTop: "56px", flexWrap: "wrap" }}>
            {[["500+", "Dishes Available"], ["50+", "Restaurants"], ["30 min", "Avg Delivery"], ["4.8★", "User Rating"]].map(([v, l]) => (
              <div key={l} style={{ textAlign: "center" }}>
                <div style={{ fontSize: "22px", fontWeight: 800, color: "white" }}>{v}</div>
                <div style={{ fontSize: "12px", color: "rgba(255,255,255,0.7)", marginTop: "2px" }}>{l}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════ FEATURES ════════════════ */}
      <section style={{ background: "#f8f5f2", padding: "90px 40px" }}>
        <div style={{ maxWidth: "1000px", margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: "56px" }}>
            <span style={{ background: "#fff3ea", color: "#ff6b00", borderRadius: "20px", padding: "5px 16px", fontSize: "13px", fontWeight: 700 }}>
              WHY FOODEXPRESS
            </span>
            <h2 style={{ fontSize: "36px", fontWeight: 800, margin: "16px 0 12px", letterSpacing: "-0.5px" }}>
              Everything you need in one place
            </h2>
            <p style={{ color: "#6b7280", fontSize: "16px", maxWidth: "480px", margin: "0 auto", lineHeight: 1.7 }}>
              Whether you're hungry or running a restaurant, FoodExpress has all the tools you need.
            </p>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "24px" }}>
            {features.map((f, i) => (
              <div key={i} style={{
                background: "white", borderRadius: "18px",
                padding: "28px 24px",
                boxShadow: "0 4px 16px rgba(0,0,0,0.06)",
                border: "1px solid #f3f4f6",
                transition: "transform 0.2s, box-shadow 0.2s",
              }}
              onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-5px)"; e.currentTarget.style.boxShadow = "0 12px 30px rgba(0,0,0,0.10)"; }}
              onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "0 4px 16px rgba(0,0,0,0.06)"; }}
              >
                <div style={{
                  width: "52px", height: "52px", borderRadius: "14px",
                  background: "linear-gradient(135deg, #fff3ea, #ffe0c4)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: "26px", marginBottom: "18px",
                }}>
                  {f.icon}
                </div>
                <h3 style={{ margin: "0 0 10px", fontSize: "17px", fontWeight: 700 }}>{f.title}</h3>
                <p style={{ margin: 0, color: "#6b7280", fontSize: "14px", lineHeight: 1.7 }}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════ HOW IT WORKS ════════════════ */}
      <section style={{ background: "white", padding: "90px 40px" }}>
        <div style={{ maxWidth: "900px", margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: "56px" }}>
            <span style={{ background: "#fff3ea", color: "#ff6b00", borderRadius: "20px", padding: "5px 16px", fontSize: "13px", fontWeight: 700 }}>
              HOW IT WORKS
            </span>
            <h2 style={{ fontSize: "36px", fontWeight: 800, margin: "16px 0 12px", letterSpacing: "-0.5px" }}>
              Order in 4 simple steps
            </h2>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: "20px" }}>
            {steps.map((s, i) => (
              <div key={i} style={{ textAlign: "center", padding: "10px" }}>
                <div style={{
                  width: "72px", height: "72px", borderRadius: "50%",
                  background: "linear-gradient(135deg, #ff6b00, #ff9f45)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: "32px", margin: "0 auto 16px",
                  boxShadow: "0 6px 20px rgba(255,107,0,0.3)",
                }}>
                  {s.icon}
                </div>
                <div style={{ fontSize: "11px", fontWeight: 800, color: "#ff6b00", letterSpacing: "1px", marginBottom: "8px" }}>
                  STEP {s.num}
                </div>
                <h3 style={{ margin: "0 0 10px", fontWeight: 700, fontSize: "16px" }}>{s.title}</h3>
                <p style={{ margin: 0, color: "#6b7280", fontSize: "13px", lineHeight: 1.7 }}>{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════ CTA BAND ════════════════ */}
      <section style={{
        background: "linear-gradient(135deg, #1f2937, #374151)",
        padding: "70px 40px",
        textAlign: "center",
      }}>
        <h2 style={{ color: "white", fontSize: "34px", fontWeight: 800, margin: "0 0 12px", letterSpacing: "-0.5px" }}>
          Ready to eat something amazing?
        </h2>
        <p style={{ color: "rgba(255,255,255,0.65)", fontSize: "16px", marginBottom: "36px" }}>
          Join thousands of happy customers on FoodExpress today.
        </p>
        <div style={{ display: "flex", gap: "14px", justifyContent: "center", flexWrap: "wrap" }}>
          <button onClick={() => navigate("/register")} style={{
            padding: "15px 36px",
            background: "linear-gradient(135deg, #ff6b00, #ff9f45)",
            color: "white", border: "none", borderRadius: "14px",
            cursor: "pointer", fontWeight: 800, fontSize: "16px",
            boxShadow: "0 6px 20px rgba(255,107,0,0.4)",
            transition: "opacity 0.2s",
          }}
          onMouseEnter={e => e.currentTarget.style.opacity = "0.88"}
          onMouseLeave={e => e.currentTarget.style.opacity = "1"}
          >
            Create Free Account 🎉
          </button>
          <button onClick={() => navigate("/login")} style={{
            padding: "15px 36px",
            background: "rgba(255,255,255,0.1)",
            color: "white", border: "2px solid rgba(255,255,255,0.25)",
            borderRadius: "14px", cursor: "pointer", fontWeight: 700, fontSize: "16px",
            transition: "background 0.2s",
          }}
          onMouseEnter={e => e.currentTarget.style.background = "rgba(255,255,255,0.18)"}
          onMouseLeave={e => e.currentTarget.style.background = "rgba(255,255,255,0.1)"}
          >
            Sign In
          </button>
        </div>
      </section>

      {/* ════════════════ FOOTER ════════════════ */}
      <footer style={{
        background: "#111827",
        padding: "48px 40px 32px",
        color: "rgba(255,255,255,0.6)",
      }}>
        <div style={{ maxWidth: "1000px", margin: "0 auto" }}>
          <div style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: "32px", marginBottom: "40px" }}>
            {/* Brand */}
            <div style={{ maxWidth: "280px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "14px" }}>
                <span style={{ fontSize: "24px" }}>🍽️</span>
                <span style={{ fontWeight: 800, fontSize: "18px", color: "white" }}>
                  Food<span style={{ color: "#ff6b00" }}>Express</span>
                </span>
              </div>
              <p style={{ fontSize: "13px", lineHeight: 1.8, margin: 0 }}>
                Connecting great food with great people. Order from your favourite restaurants and enjoy fast, reliable delivery.
              </p>
            </div>

            {/* Quick links */}
            <div>
              <div style={{ color: "white", fontWeight: 700, fontSize: "14px", marginBottom: "16px" }}>Quick Links</div>
              {[["Login", "/login"], ["Register", "/register"], ["Browse Restaurants", "/customer"]].map(([label, path]) => (
                <div key={label} style={{ marginBottom: "10px" }}>
                  <span style={{ cursor: "pointer", fontSize: "13px", transition: "color 0.2s" }}
                    onClick={() => navigate(path)}
                    onMouseEnter={e => e.currentTarget.style.color = "#ff6b00"}
                    onMouseLeave={e => e.currentTarget.style.color = "rgba(255,255,255,0.6)"}
                  >{label}</span>
                </div>
              ))}
            </div>

            {/* Support */}
            <div>
              <div style={{ color: "white", fontWeight: 700, fontSize: "14px", marginBottom: "16px" }}>Support</div>
              <div style={{ fontSize: "13px", marginBottom: "10px" }}>
                📧{" "}
                <a href={`mailto:${SUPPORT_EMAIL}`} style={{
                  color: "#ff9f45", textDecoration: "none", fontWeight: 600,
                }}>{SUPPORT_EMAIL}</a>
              </div>
              <div style={{ fontSize: "13px", marginBottom: "10px" }}>🕐 Mon–Sat, 9am–9pm IST</div>
              <div style={{ fontSize: "13px" }}>📍 Hyderabad, India</div>
            </div>
          </div>

          <div style={{
            borderTop: "1px solid rgba(255,255,255,0.1)",
            paddingTop: "20px",
            display: "flex", justifyContent: "space-between", alignItems: "center",
            flexWrap: "wrap", gap: "10px",
          }}>
            <span style={{ fontSize: "12px" }}>© 2026 FoodExpress. All rights reserved.</span>
            <span style={{ fontSize: "12px" }}>Made with ❤️ for food lovers</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
