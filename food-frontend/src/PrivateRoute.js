import { Navigate } from "react-router-dom";

function PrivateRoute({ children, role }) {
  const user = JSON.parse(localStorage.getItem("user"));

  // Not logged in
  if (!user) {
    return <Navigate to="/" />;
  }

  // Role mismatch
  if (role && user.role !== role) {
    return <Navigate to="/" />;
  }

  return children;
}

export default PrivateRoute;
