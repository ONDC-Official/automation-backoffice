import "./App.css";
import MainContent from "./components/main-content";
import TopBar from "./components/top-bar";
import LoginPage from "./pages/login";
import AuthCallback from "./pages/auth-callback";
import AdminUsersPage from "./pages/admin-users";
import { Route, Routes, Navigate } from "react-router-dom";
import NotFoundPage from "./components/ui/not-found";
import { isAuthenticated, isAdmin } from "./utils/auth";

const PrivateRoute: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  return isAuthenticated() ? <>{children}</> : <Navigate to="/login" replace />;
};

const AdminRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  if (!isAuthenticated()) return <Navigate to="/login" replace />;
  return isAdmin() ? <>{children}</> : <Navigate to="/dashboard" replace />;
};

function App() {
  return (
    <Routes>
      <Route
        path={`${import.meta.env.VITE_BASE_URL}`}
        element={
          isAuthenticated() ? (
            <Navigate to="/dashboard#api-service" replace />
          ) : (
            <LoginPage />
          )
        }
      />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/auth/callback" element={<AuthCallback />} />
      <Route
        path="/dashboard"
        element={
          <PrivateRoute>
            <>
              <TopBar />
              <main className=" pt-16 h-full flex">
                <MainContent />
              </main>
            </>
          </PrivateRoute>
        }
      />
      <Route
        path="/admin/users"
        element={
          <AdminRoute>
            <AdminUsersPage />
          </AdminRoute>
        }
      />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}

export default App;
