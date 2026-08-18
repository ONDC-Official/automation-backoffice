import React, { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { storeToken } from "../utils/auth";

// Landing page after a successful GitHub login. The backend redirects here
// with ?token=<jwt>. We persist it and forward to the dashboard.
const AuthCallback: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    const token = searchParams.get("token");
    if (!token) {
      navigate("/login?error=oauth_error", { replace: true });
      return;
    }
    storeToken(token);
    navigate("/dashboard#api-service", { replace: true });
  }, [searchParams, navigate]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <p className="text-gray-600">Signing you in…</p>
    </div>
  );
};

export default AuthCallback;
