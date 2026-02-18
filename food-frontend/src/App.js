import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./Login";
import Register from "./Register";
import OwnerDashboard from "./OwnerDashboard";
import CustomerDashboard from "./CustomerDashboard";
import PrivateRoute from "./PrivateRoute";

function App() {
  return (
    <Router>
      <Routes>

        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />

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

      </Routes>
    </Router>
  );
}

export default App;
