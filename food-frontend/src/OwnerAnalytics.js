import { useEffect, useState } from "react";
import axios from "axios";
import {
  Line
} from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement
);

function OwnerAnalytics() {

  const user = JSON.parse(localStorage.getItem("user"));

  const [analytics, setAnalytics] = useState(null);
  const [period, setPeriod] = useState("daily");

  useEffect(() => {

  const fetchAnalytics = async () => {
    const res = await axios.get(
      `http://localhost:8080/api/analytics/owner/${user.id}/${period}`
    );
    setAnalytics(res.data);
  };

  fetchAnalytics();

}, [period, user.id]);

  const fetchAnalytics = async () => {
    const res = await axios.get(
      `http://localhost:8080/api/analytics/owner/${user.id}/${period}`
    );
    setAnalytics(res.data);
  };

  if (!analytics) return <p>Loading...</p>;

  const chartData = {
    labels: Object.keys(analytics.revenueData),
    datasets: [
      {
        label: `${period.toUpperCase()} Revenue`,
        data: Object.values(analytics.revenueData),
        borderColor: "#ff6b00",
        tension: 0.4
      }
    ]
  };

  return (
    <div className="page">

      <h1 className="page-title">Revenue Analytics 📊</h1>

      {/* Toggle Buttons */}
      <div className="toggle-container">

  <button
    className={`toggle-btn ${period === "daily" ? "active" : ""}`}
    onClick={() => setPeriod("daily")}
  >
    Daily
  </button>

  <button
    className={`toggle-btn ${period === "weekly" ? "active" : ""}`}
    onClick={() => setPeriod("weekly")}
  >
    Weekly
  </button>

  <button
    className={`toggle-btn ${period === "monthly" ? "active" : ""}`}
    onClick={() => setPeriod("monthly")}
  >
    Monthly
  </button>

</div>

      <div className="card">
        <h3>Total Revenue</h3>
        <h2>₹{analytics.totalRevenue}</h2>
      </div>

      <div className="card">
        <h3>Total Orders</h3>
        <h2>{analytics.totalOrders}</h2>
      </div>

      <div className="card">
        <h3>Most Popular Item</h3>
        <h2>{analytics.mostPopularItem}</h2>
      </div>

      <div className="card">
        <Line data={chartData} />
      </div>

    </div>
  );
}

export default OwnerAnalytics;