import { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";

const SUPPORT_EMAIL = "22b81a6703.genai24@gmail.com";

function Register() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", password: "", phone: "", role: "CUSTOMER" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const register = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await axios.post("http://localhost:8080/api/auth/register", form);
      navigate("/login");
    } catch (err) {
      const msg = err?.response?.data?.message || "Registration failed. Email may already be in use.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const InputField = ({ label, type = "text", placeholder, field, icon, extra }) => (
    <div>
      <label style={{ fontSize: "13px", fontWeight: 600, color: "#374151", display: "block", marginBottom: "7px" }}>
        {label}
      </label>
      <div style={{ position: "relative" }}>
        <span style={{
          position: "absolute", left: "13px", top: "50%", transform: "translateY(-50%)",
          fontSize: "16px", pointerEvents: "none",
        }}>{icon}</span>
        <input
          type={type}
          placeholder={placeholder}
          value={form[field]}
          onChange={e => setForm({ ...form, [field]: e.target.value })}
          required={field !== "phone"}
          style={{
            width: "100%", padding: "12px 14px 12px 40px",
            border: "1.5px solid #e5e7eb", borderRadius: "10px",
            fontSize: "14px", outline: "none", boxSizing: "border-box",
            color: "#1f2937", transition: "border-color 0.2s",
            paddingRight: extra ? "44px" : "14px",
          }}
          onFocus={e => e.target.style.borderColor = "#ff6b00"}
          onBlur={e => e.target.style.borderColor = "#e5e7eb"}
        />
        {extra}
      </div>
    </div>
  );

  return (
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(135deg, #fff8f4 0%, #fff3ea 50%, #f8f5f2 100%)",
      display: "flex", alignItems: "center", justifyContent: "center",
      fontFamily: "'Segoe UI', sans-serif", padding: "20px",
    }}>
      {/* Blobs */}
      <div style={{ position: "fixed", top: "-120px", right: "-80px", width: "380px", height: "380px", borderRadius: "50%", background: "rgba(255,107,0,0.07)", pointerEvents: "none" }} />
      <div style={{ position: "fixed", bottom: "-100px", left: "-100px", width: "340px", height: "340px", borderRadius: "50%", background: "rgba(255,163,69,0.07)", pointerEvents: "none" }} />

      <div style={{ width: "100%", maxWidth: "480px" }}>
        {/* Logo */}
        <div style={{ textAlign: "center", marginBottom: "28px" }}>
          <div onClick={() => navigate("/")} style={{ cursor: "pointer", display: "inline-flex", alignItems: "center", gap: "10px" }}>
            <span style={{ fontSize: "32px" }}>🍽️</span>
            <span style={{ fontWeight: 800, fontSize: "26px", color: "#1f2937", letterSpacing: "-0.4px" }}>
              Food<span style={{ color: "#ff6b00" }}>Express</span>
            </span>
          </div>
          <p style={{ color: "#9ca3af", fontSize: "14px", margin: "10px 0 0" }}>
            Create your free account in seconds.
          </p>
        </div>

        {/* Card */}
        <div style={{
          background: "white", borderRadius: "24px",
          padding: "36px 36px 28px",
          boxShadow: "0 8px 40px rgba(0,0,0,0.10)",
          border: "1px solid rgba(255,107,0,0.08)",
        }}>
          <h2 style={{ margin: "0 0 24px", fontSize: "22px", fontWeight: 800, color: "#1f2937" }}>
            Create Account
          </h2>

          {error && (
            <div style={{
              background: "#fef2f2", border: "1px solid #fecaca",
              borderRadius: "10px", padding: "12px 16px",
              color: "#dc2626", fontSize: "13px", marginBottom: "20px",
            }}>
              ⚠️ {error}
            </div>
          )}

          <form onSubmit={register} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>

            {/* Name */}
            <InputField label="Full Name" placeholder="Advaith Sai" field="name" icon="👤" />

            {/* Email */}
            <InputField label="Email Address" type="email" placeholder="you@example.com" field="email" icon="📧" />

            {/* Password */}
            <div>
              <label style={{ fontSize: "13px", fontWeight: 600, color: "#374151", display: "block", marginBottom: "7px" }}>
                Password
              </label>
              <div style={{ position: "relative" }}>
                <span style={{ position: "absolute", left: "13px", top: "50%", transform: "translateY(-50%)", fontSize: "16px" }}>🔒</span>
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Create a strong password"
                  value={form.password}
                  onChange={e => setForm({ ...form, password: e.target.value })}
                  required
                  style={{
                    width: "100%", padding: "12px 44px 12px 40px",
                    border: "1.5px solid #e5e7eb", borderRadius: "10px",
                    fontSize: "14px", outline: "none", boxSizing: "border-box", color: "#1f2937",
                    transition: "border-color 0.2s",
                  }}
                  onFocus={e => e.target.style.borderColor = "#ff6b00"}
                  onBlur={e => e.target.style.borderColor = "#e5e7eb"}
                />
                <button type="button" onClick={() => setShowPassword(p => !p)} style={{
                  position: "absolute", right: "12px", top: "50%", transform: "translateY(-50%)",
                  background: "none", border: "none", cursor: "pointer", fontSize: "16px", color: "#9ca3af",
                }}>
                  {showPassword ? "🙈" : "👁️"}
                </button>
              </div>
            </div>

            {/* Phone */}
            <InputField label="Phone (optional)" placeholder="+91 98765 43210" field="phone" icon="📱" />

            {/* Role */}
            <div>
              <label style={{ fontSize: "13px", fontWeight: 600, color: "#374151", display: "block", marginBottom: "7px" }}>
                I am a...
              </label>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
                {[
                  { val: "CUSTOMER", label: "Customer", desc: "I want to order food", icon: "🍽️" },
                  { val: "OWNER", label: "Restaurant Owner", desc: "I manage a restaurant", icon: "🏪" },
                ].map(opt => (
                  <div
                    key={opt.val}
                    onClick={() => setForm({ ...form, role: opt.val })}
                    style={{
                      border: form.role === opt.val ? "2px solid #ff6b00" : "1.5px solid #e5e7eb",
                      borderRadius: "12px", padding: "14px 12px",
                      cursor: "pointer", textAlign: "center",
                      background: form.role === opt.val ? "#fff8f4" : "white",
                      transition: "all 0.2s",
                    }}
                  >
                    <div style={{ fontSize: "24px", marginBottom: "6px" }}>{opt.icon}</div>
                    <div style={{ fontWeight: 700, fontSize: "13px", color: form.role === opt.val ? "#ff6b00" : "#1f2937" }}>
                      {opt.label}
                    </div>
                    <div style={{ fontSize: "11px", color: "#9ca3af", marginTop: "2px" }}>{opt.desc}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Submit */}
            <button type="submit" disabled={loading} style={{
              padding: "14px",
              background: loading ? "#e5e7eb" : "linear-gradient(135deg, #ff6b00, #ff9f45)",
              color: loading ? "#9ca3af" : "white",
              border: "none", borderRadius: "12px",
              cursor: loading ? "not-allowed" : "pointer",
              fontWeight: 800, fontSize: "15px",
              boxShadow: loading ? "none" : "0 4px 16px rgba(255,107,0,0.35)",
              marginTop: "4px", transition: "all 0.2s",
            }}>
              {loading ? "Creating account..." : "Create Account 🎉"}
            </button>
          </form>

          {/* Divider + Google */}
          <div style={{ display: "flex", alignItems: "center", gap: "12px", margin: "22px 0" }}>
            <div style={{ flex: 1, height: "1px", background: "#e5e7eb" }} />
            <span style={{ fontSize: "12px", color: "#9ca3af", fontWeight: 500 }}>or sign up with</span>
            <div style={{ flex: 1, height: "1px", background: "#e5e7eb" }} />
          </div>

          <a href="http://localhost:8080/oauth2/authorization/google" style={{ textDecoration: "none" }}>
            <button style={{
              width: "100%", padding: "13px",
              background: "white", border: "1.5px solid #e5e7eb",
              borderRadius: "12px", cursor: "pointer",
              fontWeight: 600, fontSize: "14px", color: "#374151",
              display: "flex", alignItems: "center", justifyContent: "center", gap: "10px",
              transition: "border-color 0.2s, box-shadow 0.2s", boxSizing: "border-box",
            }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = "#d1d5db"; e.currentTarget.style.boxShadow = "0 2px 8px rgba(0,0,0,0.08)"; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = "#e5e7eb"; e.currentTarget.style.boxShadow = "none"; }}
            >
              <svg width="18" height="18" viewBox="0 0 48 48">
                <path fill="#4285F4" d="M47.5 24.5c0-1.6-.1-3.1-.4-4.5H24v8.5h13.2c-.6 3-2.3 5.5-4.9 7.2v6h7.9c4.6-4.2 7.3-10.5 7.3-17.2z"/>
                <path fill="#34A853" d="M24 48c6.5 0 11.9-2.1 15.9-5.8l-7.9-6c-2.1 1.4-4.8 2.3-8 2.3-6.1 0-11.3-4.1-13.2-9.7H2.7v6.2C6.7 42.8 14.8 48 24 48z"/>
                <path fill="#FBBC05" d="M10.8 28.8c-.5-1.4-.7-2.9-.7-4.8s.2-3.3.7-4.8v-6.2H2.7C1 16.3 0 20 0 24s1 7.7 2.7 10.9l8.1-6.1z"/>
                <path fill="#EA4335" d="M24 9.5c3.4 0 6.5 1.2 8.9 3.5l6.7-6.7C35.9 2.5 30.5 0 24 0 14.8 0 6.7 5.2 2.7 13.1l8.1 6.2C12.7 13.6 17.9 9.5 24 9.5z"/>
              </svg>
              Continue with Google
            </button>
          </a>
        </div>

        {/* Footer */}
        <p style={{ textAlign: "center", marginTop: "20px", color: "#6b7280", fontSize: "14px" }}>
          Already have an account?{" "}
          <Link to="/login" style={{ color: "#ff6b00", fontWeight: 700, textDecoration: "none" }}>
            Sign in →
          </Link>
        </p>
        <p style={{ textAlign: "center", marginTop: "8px", fontSize: "12px", color: "#9ca3af" }}>
          Need help?{" "}
          <a href={`mailto:${SUPPORT_EMAIL}`} style={{ color: "#9ca3af" }}>{SUPPORT_EMAIL}</a>
        </p>
        <p style={{ textAlign: "center", marginTop: "6px", fontSize: "12px" }}>
          <Link to="/" style={{ color: "#d1d5db", textDecoration: "none" }}>← Back to Home</Link>
        </p>
      </div>
    </div>
  );
}

export default Register;
