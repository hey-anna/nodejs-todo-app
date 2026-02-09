import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "./useAuth";

const RequireAuth = ({ children }) => {
  const { isAuthed } = useAuth();
  const location = useLocation();

  if (!isAuthed) {
    return <Navigate to="/signin" replace state={{ from: location.pathname }} />;
  }
  return children;
};

export default RequireAuth;
