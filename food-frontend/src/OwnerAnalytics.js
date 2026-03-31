import { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {
  Line, Bar
} from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Filler,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale, LinearScale,
  PointElement, LineElement,
  BarElement, Filler,
  Tooltip, Legend
);

const PERIODS = [
  { key: "daily",   label: "Daily",   icon: "📅" },
  { key: "weekly",  label: "Weekly",  icon: "📆" },
  { key: "monthly", label: "Monthly", icon: "🗓️" },
];

function OwnerAnalytics() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));

  const [analytics, setAnalytics] = useState(null);
  const [period, setPeriod] = useState("daily");
  const [chartType, setChartType] = useState("line");
  const [loading, setLoading] = useState(true);

  const fetchAnalytics = useCallback(async () => {
    setLoading(true);
    try {
      const res = await axios.get(
        `http://localhost:8080/api/analytics/owner/${user.id}/${period}`
      );
      setAnalytics(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [period, user.id]);

  useEffect(() => { fetchAnalytics(); }, [fetchAnalytics]);

  const labels  = analytics ? Object.keys(analytics.revenueData)   : [];
  const values  = analytics ? Object.values(analytics.revenueData) : [];

  const chartDataset = {
    label: "Revenue (₹)",
    data: values,
    borderColor: "#ff6b00",
    backgroundColor: chartType === "bar"
      ? "rgba(255,107,0,0.75)"
      : "rgba(255,107,0,0.10)",
    fill: chartType === "line",
    tension: 0.4,
    pointRadius: 5,
    pointHoverRadius: 8,
    pointBackgroundColor: "#ff6b00",
    borderWidth: 2,
    borderRadius: chartType === "bar" ? 8 : 0,
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: "#1f2937",
        titleColor: "rgba(255,255,255,0.7)",
        bodyColor: "#fff",
        padding: 10,
        callbacks: {
          label: ctx => ` ₹${ctx.parsed.y.toFixed(2)}`,
        },
      },
    },
    scales: {
      x: {
        grid: { color: "rgba(0,0,0,0.04)" },
        ticks: { color: "#9ca3af", fontSize: 11 },
      },
      y: {
        grid: { color: "rgba(0,0,0,0.04)" },
        ticks: {
          color: "#9ca3af", fontSize: 11,
          callback: v => `₹${v}`,
        },
        beginAtZero: true,
      },
    },
  };

  const statCards = analytics
    ? [
        { label: "Total Revenue",    value: `₹${Number(analytics.totalRevenue).toFixed(2)}`, icon: "💰", color: "#ff6b00", bg: "#fff8f4", border: "#fde8d4" },
        { label: "Total Orders",     value: analytics.totalOrders,                           icon: "📦", color: "#3b82f6", bg: "#eff6ff", border: "#bfdbfe" },
        { label: "Most Popular Item",value: analytics.mostPopularItem,                       icon: "🏆", color: "#8b5cf6", bg: "#f5f3ff", border: "#ddd6fe" },
        { label: "Avg Order Value",  value: analytics.totalOrders > 0
            ? `₹${(analytics.totalRevenue / analytics.totalOrders).toFixed(2)}`
            : "—",                                                                            icon: "📊", color: "#10b981", bg: "#ecfdf5", border: "#a7f3d0" },
      ]
    : [];

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
          <button onClick={() => navigate("/owner/orders")} style={{
            background: "#eff6ff", border: "1.5px solid #bfdbfe", borderRadius: "10px",
            padding: "8px 16px", cursor: "pointer", fontWeight: 600, color: "#3b82f6", fontSize: "13px",
          }}>📦 Orders</button>
        </div>
      </nav>

      {/* ── Hero ── */}
      <div style={{
        background: "linear-gradient(135deg, #1f2937, #374151)",
        padding: "36px 32px 48px", position: "relative", overflow: "hidden",
      }}>
        <div style={{ position: "absolute", top: "-50px", right: "-50px", width: "240px", height: "240px", borderRadius: "50%", background: "rgba(255,107,0,0.10)" }} />
        <div style={{ position: "absolute", bottom: "-60px", left: "10%",  width: "180px", height: "180px", borderRadius: "50%", background: "rgba(255,107,0,0.07)" }} />

        <div style={{ maxWidth: "960px", margin: "0 auto", position: "relative" }}>
          <h1 style={{ color: "white", margin: "0 0 6px", fontWeight: 800, fontSize: "28px" }}>
            📊 Revenue Analytics
          </h1>
          <p style={{ color: "rgba(255,255,255,0.55)", margin: "0 0 28px", fontSize: "14px" }}>
            Track your earnings, orders, and top-performing dishes.
          </p>

          {/* Period Toggle */}
          <div style={{ display: "inline-flex", background: "rgba(255,255,255,0.10)", borderRadius: "12px", padding: "4px", border: "1px solid rgba(255,255,255,0.15)" }}>
            {PERIODS.map(p => (
              <button
                key={p.key}
                onClick={() => setPeriod(p.key)}
                style={{
                  padding: "8px 20px",
                  borderRadius: "9px",
                  border: "none",
                  cursor: "pointer",
                  fontWeight: 700,
                  fontSize: "13px",
                  transition: "all 0.2s",
                  background: period === p.key ? "white" : "transparent",
                  color: period === p.key ? "#ff6b00" : "rgba(255,255,255,0.65)",
                  boxShadow: period === p.key ? "0 2px 8px rgba(0,0,0,0.15)" : "none",
                  display: "flex", alignItems: "center", gap: "6px",
                }}
              >
                {p.icon} {p.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ── Content ── */}
      <div style={{ maxWidth: "960px", margin: "0 auto", padding: "32px 24px" }}>

        {loading ? (
          <div style={{ textAlign: "center", padding: "80px", color: "#9ca3af" }}>
            <div style={{ fontSize: "48px", marginBottom: "16px", animation: "spin 1.5s linear infinite", display: "inline-block" }}>📊</div>
            <p style={{ fontSize: "15px" }}>Loading analytics...</p>
          </div>
        ) : (
          <>
            {/* ── KPI Cards ── */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "16px", marginBottom: "28px" }}>
              {statCards.map((s, i) => (
                <div key={i} style={{
                  background: "white", borderRadius: "16px",
                  padding: "20px 22px",
                  boxShadow: "0 4px 16px rgba(0,0,0,0.06)",
                  border: `2px solid ${s.border}`,
                  background: s.bg,
                  display: "flex", alignItems: "center", gap: "14px",
                  transition: "transform 0.2s, box-shadow 0.2s",
                }}
                onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-3px)"; e.currentTarget.style.boxShadow = "0 8px 24px rgba(0,0,0,0.10)"; }}
                onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "0 4px 16px rgba(0,0,0,0.06)"; }}
                >
                  <div style={{
                    width: "48px", height: "48px", borderRadius: "12px",
                    background: "white", display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: "24px", flexShrink: 0,
                    boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
                  }}>{s.icon}</div>
                  <div style={{ minWidth: 0 }}>
                    <div style={{ fontSize: "11px", fontWeight: 600, color: "#9ca3af", marginBottom: "4px", textTransform: "uppercase", letterSpacing: "0.4px" }}>
                      {s.label}
                    </div>
                    <div style={{
                      fontSize: "20px", fontWeight: 800, color: s.color,
                      whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
                    }}>
                      {s.value}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* ── Chart Card ── */}
            <div style={{ background: "white", borderRadius: "20px", boxShadow: "0 4px 20px rgba(0,0,0,0.07)", padding: "24px 24px 20px", border: "1px solid #f3f4f6" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px", flexWrap: "wrap", gap: "12px" }}>
                <div>
                  <h2 style={{ margin: "0 0 4px", fontSize: "17px", fontWeight: 800, color: "#1f2937" }}>
                    Revenue Over Time
                  </h2>
                  <p style={{ margin: 0, fontSize: "13px", color: "#9ca3af" }}>
                    {period.charAt(0).toUpperCase() + period.slice(1)} breakdown of delivered-order revenue
                  </p>
                </div>

                {/* Chart type toggle */}
                <div style={{ display: "inline-flex", background: "#f9fafb", borderRadius: "10px", padding: "3px", border: "1px solid #e5e7eb" }}>
                  {[{ key: "line", icon: "📈" }, { key: "bar", icon: "📊" }].map(t => (
                    <button
                      key={t.key}
                      onClick={() => setChartType(t.key)}
                      style={{
                        padding: "6px 16px",
                        borderRadius: "8px",
                        border: "none",
                        cursor: "pointer",
                        fontWeight: 700,
                        fontSize: "13px",
                        transition: "all 0.2s",
                        background: chartType === t.key ? "white" : "transparent",
                        color: chartType === t.key ? "#ff6b00" : "#9ca3af",
                        boxShadow: chartType === t.key ? "0 1px 4px rgba(0,0,0,0.10)" : "none",
                      }}
                    >
                      {t.icon} {t.key.charAt(0).toUpperCase() + t.key.slice(1)}
                    </button>
                  ))}
                </div>
              </div>

              {labels.length === 0 ? (
                <div style={{ textAlign: "center", padding: "48px", color: "#9ca3af" }}>
                  <div style={{ fontSize: "44px", marginBottom: "12px" }}>📭</div>
                  <p>No delivered orders in this period yet.</p>
                </div>
              ) : (
                <div style={{ height: "300px" }}>
                  {chartType === "line" ? (
                    <Line data={{ labels, datasets: [chartDataset] }} options={{ ...chartOptions, maintainAspectRatio: false }} />
                  ) : (
                    <Bar  data={{ labels, datasets: [chartDataset] }} options={{ ...chartOptions, maintainAspectRatio: false }} />
                  )}
                </div>
              )}
            </div>

            {/* ── Revenue Breakdown Table ── */}
            {labels.length > 0 && (
              <div style={{ background: "white", borderRadius: "20px", boxShadow: "0 4px 16px rgba(0,0,0,0.06)", marginTop: "20px", overflow: "hidden", border: "1px solid #f3f4f6" }}>
                <div style={{ padding: "18px 24px", borderBottom: "1px solid #f3f4f6" }}>
                  <h2 style={{ margin: 0, fontSize: "16px", fontWeight: 800, color: "#1f2937" }}>Breakdown</h2>
                </div>
                <div style={{ overflow: "auto" }}>
                  <table style={{ width: "100%", borderCollapse: "collapse" }}>
                    <thead>
                      <tr style={{ background: "#f9fafb" }}>
                        {[period === "daily" ? "Date" : period === "weekly" ? "Week" : "Month", "Revenue"].map(h => (
                          <th key={h} style={{ padding: "12px 24px", textAlign: "left", fontSize: "12px", fontWeight: 700, color: "#6b7280", textTransform: "uppercase", letterSpacing: "0.4px" }}>{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {labels.map((label, i) => (
                        <tr key={label} style={{ borderTop: "1px solid #f3f4f6", background: i % 2 === 0 ? "white" : "#fafafa" }}>
                          <td style={{ padding: "12px 24px", fontSize: "14px", color: "#374151", fontWeight: 500 }}>{label}</td>
                          <td style={{ padding: "12px 24px", fontSize: "14px", fontWeight: 800, color: "#ff6b00" }}>₹{values[i].toFixed(2)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to   { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}

export default OwnerAnalytics;