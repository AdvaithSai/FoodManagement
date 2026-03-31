import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function OAuthSuccess() {
  const navigate = useNavigate();
  const [status, setStatus] = useState("loading"); // loading | error

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const email = params.get("email");

    if (!email) {
      setStatus("error");
      return;
    }

    // Use dedicated OAuth endpoint — no password check needed,
    // Google already authenticated the user on the backend.
    axios
      .get(`http://localhost:8080/api/auth/oauth-user?email=${encodeURIComponent(email)}`)
      .then((res) => {
        localStorage.setItem("user", JSON.stringify(res.data));
        if (res.data.role === "OWNER") {
          navigate("/owner");
        } else {
          navigate("/customer");
        }
      })
      .catch(() => {
        setStatus("error");
      });
  }, [navigate]);

  if (status === "error") {
    return (
      <div style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #fff8f4, #f8f5f2)",
        display: "flex", alignItems: "center", justifyContent: "center",
        flexDirection: "column", gap: "16px",
        fontFamily: "'Segoe UI', sans-serif",
      }}>
        <div style={{ fontSize: "56px" }}>⚠️</div>
        <h2 style={{ color: "#1f2937", fontWeight: 800, margin: 0 }}>Sign-in failed</h2>
        <p style={{ color: "#6b7280", margin: 0 }}>Something went wrong during Google sign-in.</p>
        <button
          onClick={() => navigate("/login")}
          style={{
            marginTop: "8px",
            padding: "12px 28px",
            background: "linear-gradient(135deg, #ff6b00, #ff9f45)",
            color: "white", border: "none", borderRadius: "12px",
            cursor: "pointer", fontWeight: 700, fontSize: "15px",
            boxShadow: "0 4px 14px rgba(255,107,0,0.3)",
          }}
        >
          Back to Login
        </button>
      </div>
    );
  }

  return (
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(135deg, #fff8f4, #f8f5f2)",
      display: "flex", alignItems: "center", justifyContent: "center",
      flexDirection: "column", gap: "20px",
      fontFamily: "'Segoe UI', sans-serif",
    }}>
      {/* Spinner */}
      <div style={{
        width: "72px", height: "72px", borderRadius: "50%",
        background: "linear-gradient(135deg, #ff6b00, #ff9f45)",
        display: "flex", alignItems: "center", justifyContent: "center",
        fontSize: "34px",
        boxShadow: "0 6px 24px rgba(255,107,0,0.35)",
        animation: "pulse 1.8s ease-in-out infinite",
      }}>
        🍽️
      </div>

      <div style={{ textAlign: "center" }}>
        <h2 style={{ margin: "0 0 8px", fontSize: "22px", fontWeight: 800, color: "#1f2937" }}>
          Signing you in...
        </h2>
        <p style={{ margin: 0, color: "#9ca3af", fontSize: "14px" }}>
          Just a moment while we set things up for you.
        </p>
      </div>

      {/* Animated dots */}
      <div style={{ display: "flex", gap: "8px" }}>
        {[0, 1, 2].map(i => (
          <div key={i} style={{
            width: "8px", height: "8px", borderRadius: "50%",
            background: "#ff6b00",
            animation: `bounce 1.2s ease-in-out ${i * 0.2}s infinite`,
          }} />
        ))}
      </div>

      <style>{`
        @keyframes pulse {
          0%, 100% { transform: scale(1); box-shadow: 0 6px 24px rgba(255,107,0,0.35); }
          50% { transform: scale(1.08); box-shadow: 0 10px 32px rgba(255,107,0,0.5); }
        }
        @keyframes bounce {
          0%, 100% { transform: translateY(0); opacity: 0.4; }
          50% { transform: translateY(-8px); opacity: 1; }
        }
      `}</style>
    </div>
  );
}

export default OAuthSuccess;