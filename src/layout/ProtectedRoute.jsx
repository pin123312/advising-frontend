import { Navigate } from "react-router-dom";
import { useUser } from "../hooks/useUser.js";

const ProtectedRoute = ({ children }) => {
  const { user, token } = useUser();

  if (!user || !token) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;
