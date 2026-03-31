import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LandingPage from "./LandingPage";
import Login from "./Login";
import Register from "./Register";
import OwnerDashboard from "./OwnerDashboard";
import CustomerDashboard from "./CustomerDashboard";
import PrivateRoute from "./PrivateRoute";
import Menu from "./Menu";
import Cart from "./Cart";
import OrderHistory from "./OrderHistory";
import OwnerOrders from "./OwnerOrders";
import OwnerAnalytics from "./OwnerAnalytics";
import OAuthSuccess from "./OAuthSuccess";

function App() {
  return (
    <Router>
      <Routes>

        {/* Public */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/oauth-success" element={<OAuthSuccess />} />

        {/* Customer */}
        <Route path="/menu/:id" element={<Menu />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/orders" element={<OrderHistory />} />
        <Route
          path="/customer"
          element={
            <PrivateRoute role="CUSTOMER">
              <CustomerDashboard />
            </PrivateRoute>
          }
        />

        {/* Owner */}
        <Route path="/owner/orders" element={<OwnerOrders />} />
        <Route path="/owner/analytics" element={<OwnerAnalytics />} />
        <Route
          path="/owner"
          element={
            <PrivateRoute role="OWNER">
              <OwnerDashboard />
            </PrivateRoute>
          }
        />

      </Routes>
    </Router>
  );
}

export default App;
