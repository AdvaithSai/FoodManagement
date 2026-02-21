import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
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

        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/menu/:id" element={<Menu />} />
        <Route path="/cart" element={<Cart />} />
<Route path="/orders" element={<OrderHistory />} />
<Route path="/owner/orders" element={<OwnerOrders />} />
<Route path="/oauth-success" element={<OAuthSuccess />} />

        <Route
          path="/owner"
          element={
            <PrivateRoute role="OWNER">
              <OwnerDashboard />
            </PrivateRoute>
          }
        />

        <Route
          path="/customer"
          element={
            <PrivateRoute role="CUSTOMER">
              <CustomerDashboard />
            </PrivateRoute>
          }
        />
        <Route
  path="/owner/analytics"
  element={<OwnerAnalytics />}
/>

      </Routes>
    </Router>
  );
}

export default App;
