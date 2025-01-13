import { useEffect, useState } from "react";
// import { ToastContainer } from "react-toastify";
import "./App.css";
import MainContent from "./components/main-content";
import TopBar from "./components/top-bar";
import LoginPage from "./pages/login";
import {
  // BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import NotFoundPage from "./components/ui/not-found";

const isAuthenticated = (): boolean => {
  return localStorage.getItem("userData") !== null;
};

const PrivateRoute: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  return isAuthenticated() ? <>{children}</> : <Navigate to="/" replace />;
};

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem("userData") as string);

    console.log("userData");

    setUser(userData || "");
  }, []);

  if (user === null) {
    return <div>Loding...</div>;
  }

  console.log("?>", import.meta.env.VITE_BASE_URL);

  return (
    <Routes>
      <Route
        path={`${import.meta.env.VITE_BASE_URL}`}
        element={<LoginPage />}
      />
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
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}

export default App;
