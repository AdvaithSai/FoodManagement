import { useState, useEffect, useRef } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";

const SUPPORT_EMAIL = "22b81a6703.genai24@gmail.com";
const BASE = "http://localhost:8080/api/auth";
const OTP_EXPIRY_SECONDS = 600; // 10 min, matches backend TTL

/* ─── Step indicator ─────────────────────────────────────────── */
function StepDots({ step }) {
  return (
    <div style={{ display: "flex", justifyContent: "center", gap: "8px", marginBottom: "24px" }}>
      {[0, 1, 2].map(i => (
        <div key={i} style={{
          width: i === step ? "24px" : "8px",
          height: "8px", borderRadius: "4px",
          background: i <= step ? "#ff6b00" : "#e5e7eb",
          transition: "all 0.3s ease",
        }} />
      ))}
    </div>
  );
}

/* ─── Forgot Password Modal ──────────────────────────────────── */
function ForgotPasswordModal({ onClose }) {
  const [step, setStep]         = useState(0); // 0=email, 1=otp, 2=newpass
  const [email, setEmail]       = useState("");
  const [otp, setOtp]           = useState(["", "", "", "", "", ""]);
  const [newPass, setNewPass]   = useState("");
  const [confirmPass, setConfirmPass] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState("");
  const [success, setSuccess]   = useState("");
  const [timeLeft, setTimeLeft] = useState(OTP_EXPIRY_SECONDS);
  const otpRefs = useRef([]);
  const timerRef = useRef(null);

  /* Start countdown when we enter OTP step */
  useEffect(() => {
    if (step !== 1) return;
    setTimeLeft(OTP_EXPIRY_SECONDS);
    timerRef.current = setInterval(() => {
      setTimeLeft(t => {
        if (t <= 1) { clearInterval(timerRef.current); return 0; }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(timerRef.current);
  }, [step]);

  const fmt = (s) => `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;

  /* ── Step 0: Send OTP ── */
  const sendOtp = async (e) => {
    e.preventDefault();
    setError(""); setLoading(true);
    try {
      await axios.post(`${BASE}/forgot-password?email=${encodeURIComponent(email)}`);
      setStep(1);
    } catch {
      setError("Something went wrong. Please try again.");
    } finally { setLoading(false); }
  };

  /* ── OTP digit input handling ── */
  const handleOtpChange = (val, idx) => {
    if (!/^\d?$/.test(val)) return;
    const next = [...otp];
    next[idx] = val;
    setOtp(next);
    if (val && idx < 5) otpRefs.current[idx + 1]?.focus();
  };

  const handleOtpKey = (e, idx) => {
    if (e.key === "Backspace" && !otp[idx] && idx > 0) {
      otpRefs.current[idx - 1]?.focus();
    }
  };

  const handleOtpPaste = (e) => {
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    if (pasted.length === 6) {
      setOtp(pasted.split(""));
      otpRefs.current[5]?.focus();
    }
  };

  /* ── Step 1: Verify OTP ── */
  const verifyOtp = async (e) => {
    e.preventDefault();
    const code = otp.join("");
    if (code.length < 6) { setError("Please enter all 6 digits."); return; }
    setError(""); setLoading(true);
    try {
      await axios.post(`${BASE}/verify-otp?email=${encodeURIComponent(email)}&otp=${code}`);
      setStep(2);
    } catch (err) {
      setError(err?.response?.data || "Invalid or expired OTP.");
    } finally { setLoading(false); }
  };

  /* ── Step 2: Reset Password ── */
  const resetPassword = async (e) => {
    e.preventDefault();
    if (newPass.length < 6) { setError("Password must be at least 6 characters."); return; }
    if (newPass !== confirmPass) { setError("Passwords do not match."); return; }
    setError(""); setLoading(true);
    try {
      await axios.post(`${BASE}/reset-password?email=${encodeURIComponent(email)}&newPassword=${encodeURIComponent(newPass)}`);
      setSuccess("Password changed successfully! You can now log in.");
    } catch {
      setError("Something went wrong. Please try again.");
    } finally { setLoading(false); }
  };

  const inputBase = {
    width: "100%", padding: "12px 14px",
    border: "1.5px solid #e5e7eb", borderRadius: "10px",
    fontSize: "14px", outline: "none", boxSizing: "border-box", color: "#1f2937",
    transition: "border-color 0.2s",
  };

  return (
    /* Overlay */
    <div style={{
      position: "fixed", inset: 0, zIndex: 1000,
      background: "rgba(0,0,0,0.45)", backdropFilter: "blur(4px)",
      display: "flex", alignItems: "center", justifyContent: "center",
      padding: "20px",
      animation: "fadeIn 0.2s ease",
    }}>
      {/* Modal card */}
      <div style={{
        background: "white", borderRadius: "24px",
        padding: "36px 32px 28px",
        width: "100%", maxWidth: "420px",
        boxShadow: "0 24px 64px rgba(0,0,0,0.20)",
        position: "relative",
        animation: "slideUp 0.3s ease",
      }}>
        {/* Close */}
        <button onClick={onClose} style={{
          position: "absolute", top: "16px", right: "16px",
          background: "#f3f4f6", border: "none", borderRadius: "8px",
          width: "32px", height: "32px", cursor: "pointer",
          fontSize: "16px", color: "#6b7280", display: "flex",
          alignItems: "center", justifyContent: "center",
        }}>✕</button>

        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: "20px" }}>
          <div style={{
            width: "56px", height: "56px", borderRadius: "16px",
            background: "linear-gradient(135deg, #fff3ea, #ffd7ae)",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: "28px", margin: "0 auto 14px",
          }}>🔐</div>
          <h2 style={{ margin: "0 0 6px", fontSize: "20px", fontWeight: 800, color: "#1f2937" }}>
            {step === 0 ? "Forgot Password"
             : step === 1 ? "Enter OTP"
             : success   ? "All Done!"
             : "New Password"}
          </h2>
          <p style={{ margin: 0, fontSize: "13px", color: "#9ca3af" }}>
            {step === 0 && "We'll send a 6-digit OTP to your email."}
            {step === 1 && !success && `Code sent to ${email}. Valid for ${fmt(timeLeft)}.`}
            {step === 2 && !success && "Choose a strong password for your account."}
            {success && "You can now sign in with your new password."}
          </p>
        </div>

        <StepDots step={step} />

        {/* Error / Success */}
        {error && (
          <div style={{ background: "#fef2f2", border: "1px solid #fecaca", borderRadius: "10px", padding: "11px 14px", color: "#dc2626", fontSize: "13px", marginBottom: "16px" }}>
            ⚠️ {error}
          </div>
        )}
        {success && (
          <div style={{ background: "#ecfdf5", border: "1px solid #a7f3d0", borderRadius: "10px", padding: "11px 14px", color: "#065f46", fontSize: "13px", marginBottom: "16px" }}>
            ✅ {success}
          </div>
        )}

        {/* ── STEP 0: Email ── */}
        {step === 0 && (
          <form onSubmit={sendOtp} style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
            <div>
              <label style={{ fontSize: "13px", fontWeight: 600, color: "#374151", display: "block", marginBottom: "7px" }}>
                Email Address
              </label>
              <input
                type="email" required
                placeholder="Enter your registered email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                style={inputBase}
                onFocus={e => e.target.style.borderColor = "#ff6b00"}
                onBlur={e => e.target.style.borderColor = "#e5e7eb"}
              />
            </div>
            <button type="submit" disabled={loading} style={{
              padding: "13px", borderRadius: "12px", border: "none",
              background: loading ? "#e5e7eb" : "linear-gradient(135deg, #ff6b00, #ff9f45)",
              color: loading ? "#9ca3af" : "white",
              fontWeight: 800, fontSize: "15px",
              cursor: loading ? "not-allowed" : "pointer",
              boxShadow: loading ? "none" : "0 4px 14px rgba(255,107,0,0.3)",
            }}>
              {loading ? "Sending OTP..." : "Send OTP →"}
            </button>
          </form>
        )}

        {/* ── STEP 1: OTP Entry ── */}
        {step === 1 && !success && (
          <form onSubmit={verifyOtp} style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
            {/* 6-box OTP input */}
            <div>
              <label style={{ fontSize: "13px", fontWeight: 600, color: "#374151", display: "block", marginBottom: "12px", textAlign: "center" }}>
                Enter the 6-digit code
              </label>
              <div style={{ display: "flex", gap: "8px", justifyContent: "center" }} onPaste={handleOtpPaste}>
                {otp.map((d, i) => (
                  <input
                    key={i}
                    ref={el => otpRefs.current[i] = el}
                    type="text" inputMode="numeric" maxLength={1}
                    value={d}
                    onChange={e => handleOtpChange(e.target.value, i)}
                    onKeyDown={e => handleOtpKey(e, i)}
                    style={{
                      width: "46px", height: "54px",
                      textAlign: "center", fontSize: "22px", fontWeight: 800,
                      border: d ? "2px solid #ff6b00" : "2px solid #e5e7eb",
                      borderRadius: "12px", outline: "none",
                      color: "#1f2937", background: d ? "#fff8f4" : "white",
                      transition: "all 0.2s",
                    }}
                    onFocus={e => e.target.style.borderColor = "#ff6b00"}
                    onBlur={e => e.target.style.borderColor = d ? "#ff6b00" : "#e5e7eb"}
                  />
                ))}
              </div>

              {/* Countdown */}
              <div style={{ textAlign: "center", marginTop: "12px" }}>
                {timeLeft > 0 ? (
                  <span style={{ fontSize: "13px", color: timeLeft < 60 ? "#ef4444" : "#9ca3af" }}>
                    ⏱️ Expires in <strong>{fmt(timeLeft)}</strong>
                  </span>
                ) : (
                  <span style={{ fontSize: "13px", color: "#ef4444" }}>OTP expired.</span>
                )}
              </div>
            </div>

            <button type="submit" disabled={loading || timeLeft === 0} style={{
              padding: "13px", borderRadius: "12px", border: "none",
              background: loading || timeLeft === 0 ? "#e5e7eb" : "linear-gradient(135deg, #ff6b00, #ff9f45)",
              color: loading || timeLeft === 0 ? "#9ca3af" : "white",
              fontWeight: 800, fontSize: "15px",
              cursor: loading || timeLeft === 0 ? "not-allowed" : "pointer",
              boxShadow: loading || timeLeft === 0 ? "none" : "0 4px 14px rgba(255,107,0,0.3)",
            }}>
              {loading ? "Verifying..." : "Verify OTP →"}
            </button>

            {/* Resend */}
            <p style={{ textAlign: "center", fontSize: "13px", color: "#9ca3af", margin: 0 }}>
              Didn't receive it?{" "}
              <span
                onClick={async () => {
                  setError(""); setOtp(["","","","","",""]);
                  await axios.post(`${BASE}/forgot-password?email=${encodeURIComponent(email)}`);
                  setTimeLeft(OTP_EXPIRY_SECONDS);
                }}
                style={{ color: "#ff6b00", fontWeight: 700, cursor: "pointer", textDecoration: "underline" }}
              >Resend OTP</span>
            </p>
          </form>
        )}

        {/* ── STEP 2: New Password ── */}
        {step === 2 && !success && (
          <form onSubmit={resetPassword} style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
            <div>
              <label style={{ fontSize: "13px", fontWeight: 600, color: "#374151", display: "block", marginBottom: "7px" }}>
                New Password
              </label>
              <div style={{ position: "relative" }}>
                <input
                  type={showPass ? "text" : "password"} required
                  placeholder="Min. 6 characters"
                  value={newPass}
                  onChange={e => setNewPass(e.target.value)}
                  style={{ ...inputBase, paddingRight: "44px" }}
                  onFocus={e => e.target.style.borderColor = "#ff6b00"}
                  onBlur={e => e.target.style.borderColor = "#e5e7eb"}
                />
                <button type="button" onClick={() => setShowPass(p => !p)} style={{
                  position: "absolute", right: "12px", top: "50%", transform: "translateY(-50%)",
                  background: "none", border: "none", cursor: "pointer", fontSize: "16px", color: "#9ca3af",
                }}>{showPass ? "🙈" : "👁️"}</button>
              </div>
              {/* Strength bar */}
              {newPass.length > 0 && (
                <div style={{ marginTop: "8px" }}>
                  <div style={{ display: "flex", gap: "4px", marginBottom: "4px" }}>
                    {[0,1,2,3].map(i => {
                      const strength = Math.min(Math.floor(newPass.length / 3), 4);
                      const colors = ["#ef4444","#f59e0b","#3b82f6","#10b981"];
                      return <div key={i} style={{ height: "4px", flex: 1, borderRadius: "2px", background: i < strength ? colors[strength - 1] : "#e5e7eb", transition: "background 0.3s" }} />;
                    })}
                  </div>
                  <span style={{ fontSize: "11px", color: "#9ca3af" }}>
                    {newPass.length < 3 ? "Weak" : newPass.length < 6 ? "Fair" : newPass.length < 9 ? "Good" : "Strong"}
                  </span>
                </div>
              )}
            </div>

            <div>
              <label style={{ fontSize: "13px", fontWeight: 600, color: "#374151", display: "block", marginBottom: "7px" }}>
                Confirm Password
              </label>
              <input
                type={showPass ? "text" : "password"} required
                placeholder="Re-enter new password"
                value={confirmPass}
                onChange={e => setConfirmPass(e.target.value)}
                style={{ ...inputBase, borderColor: confirmPass && confirmPass !== newPass ? "#ef4444" : undefined }}
                onFocus={e => e.target.style.borderColor = "#ff6b00"}
                onBlur={e => e.target.style.borderColor = confirmPass !== newPass ? "#ef4444" : "#e5e7eb"}
              />
              {confirmPass && confirmPass !== newPass && (
                <p style={{ margin: "5px 0 0", fontSize: "12px", color: "#ef4444" }}>Passwords do not match</p>
              )}
            </div>

            <button type="submit" disabled={loading} style={{
              padding: "13px", borderRadius: "12px", border: "none",
              background: loading ? "#e5e7eb" : "linear-gradient(135deg, #ff6b00, #ff9f45)",
              color: loading ? "#9ca3af" : "white",
              fontWeight: 800, fontSize: "15px",
              cursor: loading ? "not-allowed" : "pointer",
              boxShadow: loading ? "none" : "0 4px 14px rgba(255,107,0,0.3)",
            }}>
              {loading ? "Updating..." : "Set New Password →"}
            </button>
          </form>
        )}

        {/* ── SUCCESS state ── */}
        {success && (
          <button onClick={onClose} style={{
            width: "100%", padding: "13px", borderRadius: "12px", border: "none",
            background: "linear-gradient(135deg, #ff6b00, #ff9f45)",
            color: "white", fontWeight: 800, fontSize: "15px",
            cursor: "pointer", boxShadow: "0 4px 14px rgba(255,107,0,0.3)",
          }}>
            Back to Login →
          </button>
        )}
      </div>
    </div>
  );
}

/* ─── Main Login Page ─────────────────────────────────────────── */
function Login() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showForgot, setShowForgot] = useState(false);

  const login = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await axios.post("http://localhost:8080/api/auth/login", form);
      if (res.data) {
        localStorage.setItem("user", JSON.stringify(res.data));
        navigate(res.data.role === "OWNER" ? "/owner" : "/customer");
      }
    } catch {
      setError("Invalid email or password. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(135deg, #fff8f4 0%, #fff3ea 50%, #f8f5f2 100%)",
      display: "flex", alignItems: "center", justifyContent: "center",
      fontFamily: "'Segoe UI', sans-serif", padding: "20px",
    }}>
      {/* Decorative blobs */}
      <div style={{ position: "fixed", top: "-100px", right: "-100px", width: "400px", height: "400px", borderRadius: "50%", background: "rgba(255,107,0,0.07)", pointerEvents: "none" }} />
      <div style={{ position: "fixed", bottom: "-80px", left: "-80px", width: "300px", height: "300px", borderRadius: "50%", background: "rgba(255,163,69,0.08)", pointerEvents: "none" }} />

      {/* Forgot Password Modal */}
      {showForgot && <ForgotPasswordModal onClose={() => setShowForgot(false)} />}

      <div style={{ width: "100%", maxWidth: "440px" }}>
        {/* Logo */}
        <div style={{ textAlign: "center", marginBottom: "32px" }}>
          <div onClick={() => navigate("/")} style={{ cursor: "pointer", display: "inline-flex", alignItems: "center", gap: "10px" }}>
            <span style={{ fontSize: "32px" }}>🍽️</span>
            <span style={{ fontWeight: 800, fontSize: "26px", color: "#1f2937", letterSpacing: "-0.4px" }}>
              Food<span style={{ color: "#ff6b00" }}>Express</span>
            </span>
          </div>
          <p style={{ color: "#9ca3af", fontSize: "14px", margin: "10px 0 0" }}>
            Welcome back! Sign in to continue.
          </p>
        </div>

        {/* Card */}
        <div style={{
          background: "white", borderRadius: "24px",
          padding: "36px 36px 28px",
          boxShadow: "0 8px 40px rgba(0,0,0,0.10)",
          border: "1px solid rgba(255,107,0,0.08)",
        }}>
          <h2 style={{ margin: "0 0 28px", fontSize: "22px", fontWeight: 800, color: "#1f2937" }}>
            Sign In
          </h2>

          {error && (
            <div style={{ background: "#fef2f2", border: "1px solid #fecaca", borderRadius: "10px", padding: "12px 16px", color: "#dc2626", fontSize: "13px", marginBottom: "20px", display: "flex", gap: "8px", alignItems: "center" }}>
              ⚠️ {error}
            </div>
          )}

          <form onSubmit={login} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            {/* Email */}
            <div>
              <label style={{ fontSize: "13px", fontWeight: 600, color: "#374151", display: "block", marginBottom: "7px" }}>
                Email address
              </label>
              <input
                type="email" placeholder="you@example.com"
                value={form.email}
                onChange={e => setForm({ ...form, email: e.target.value })}
                required
                style={{ width: "100%", padding: "12px 14px", border: "1.5px solid #e5e7eb", borderRadius: "10px", fontSize: "14px", outline: "none", boxSizing: "border-box", transition: "border-color 0.2s", color: "#1f2937" }}
                onFocus={e => e.target.style.borderColor = "#ff6b00"}
                onBlur={e => e.target.style.borderColor = "#e5e7eb"}
              />
            </div>

            {/* Password */}
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "7px" }}>
                <label style={{ fontSize: "13px", fontWeight: 600, color: "#374151" }}>
                  Password
                </label>
                {/* ── Forgot Password link ── */}
                <button type="button" onClick={() => setShowForgot(true)} style={{
                  background: "none", border: "none", cursor: "pointer",
                  fontSize: "12px", fontWeight: 600, color: "#ff6b00",
                  textDecoration: "underline", padding: 0,
                }}>
                  Forgot password?
                </button>
              </div>
              <div style={{ position: "relative" }}>
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={form.password}
                  onChange={e => setForm({ ...form, password: e.target.value })}
                  required
                  style={{ width: "100%", padding: "12px 44px 12px 14px", border: "1.5px solid #e5e7eb", borderRadius: "10px", fontSize: "14px", outline: "none", boxSizing: "border-box", transition: "border-color 0.2s", color: "#1f2937" }}
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
              {loading ? "Signing in..." : "Sign In →"}
            </button>
          </form>

          {/* Divider */}
          <div style={{ display: "flex", alignItems: "center", gap: "12px", margin: "22px 0" }}>
            <div style={{ flex: 1, height: "1px", background: "#e5e7eb" }} />
            <span style={{ fontSize: "12px", color: "#9ca3af", fontWeight: 500 }}>or continue with</span>
            <div style={{ flex: 1, height: "1px", background: "#e5e7eb" }} />
          </div>

          {/* Google OAuth */}
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

        {/* Footer links */}
        <p style={{ textAlign: "center", marginTop: "20px", color: "#6b7280", fontSize: "14px" }}>
          Don't have an account?{" "}
          <Link to="/register" style={{ color: "#ff6b00", fontWeight: 700, textDecoration: "none" }}>
            Sign up free →
          </Link>
        </p>
        <p style={{ textAlign: "center", marginTop: "8px", fontSize: "12px", color: "#9ca3af" }}>
          Need help? <a href={`mailto:${SUPPORT_EMAIL}`} style={{ color: "#9ca3af" }}>{SUPPORT_EMAIL}</a>
        </p>
        <p style={{ textAlign: "center", marginTop: "6px", fontSize: "12px" }}>
          <Link to="/" style={{ color: "#d1d5db", textDecoration: "none" }}>← Back to Home</Link>
        </p>
      </div>

      <style>{`
        @keyframes fadeIn  { from { opacity: 0 } to { opacity: 1 } }
        @keyframes slideUp { from { opacity: 0; transform: translateY(30px) } to { opacity: 1; transform: translateY(0) } }
      `}</style>
    </div>
  );
}

export default Login;
