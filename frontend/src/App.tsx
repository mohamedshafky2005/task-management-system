import {
  Navigate,
  Route,
  Routes,
} from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute";
import DashboardPage from "./pages/DashboardPage";
import LoginPage from "./pages/LoginPage";
import { useAuth } from "./context/AuthContext";

export default function App() {
  const { isAuthenticated } = useAuth();

  return (
      <Routes>
        <Route
            path="/login"
            element={
              isAuthenticated ? (
                  <Navigate
                      to="/dashboard"
                      replace
                  />
              ) : (
                  <LoginPage />
              )
            }
        />

        <Route element={<ProtectedRoute />}>
          <Route
              path="/dashboard"
              element={<DashboardPage />}
          />
        </Route>

        <Route
            path="*"
            element={
              <Navigate
                  to={
                    isAuthenticated
                        ? "/dashboard"
                        : "/login"
                  }
                  replace
              />
            }
        />
      </Routes>
  );
}