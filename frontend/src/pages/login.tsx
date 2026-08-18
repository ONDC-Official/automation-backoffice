import React from "react";
import { FaGithub } from "react-icons/fa";
import { useSearchParams } from "react-router-dom";

const errorMessages: Record<string, string> = {
  missing_code: "GitHub did not return an authorization code. Please try again.",
  token_exchange_failed: "Could not complete GitHub sign-in. Please try again.",
  oauth_error: "Something went wrong during sign-in. Please try again.",
  not_authorized:
    "This GitHub account does not have access. Please contact an administrator to be added.",
};

const LoginPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const error = searchParams.get("error");
  const login = searchParams.get("login");

  const handleGithubLogin = () => {
    // Full-page redirect to the backend, which forwards to GitHub.
    window.location.href = `${import.meta.env.VITE_BACKEND_URL}/auth/github`;
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-sm bg-white p-6 rounded-lg shadow-md">
        <div className="flex flex-col items-center mb-6">
          <img
            src="https://seeklogo.com/images/O/open-network-for-digital-commerce-logo-E7F55933B3-seeklogo.com.png"
            alt="Logo"
            className="h-16 w-auto"
          />
          <h1 className="text-2xl font-semibold text-gray-700 mt-2">
            Back Office
          </h1>
          <p className="text-sm text-gray-500 mt-1 text-center">
            Sign in with your GitHub account
          </p>
        </div>

        {error && (
          <div className="mb-4 rounded-md bg-red-50 border border-red-200 px-3 py-2 text-sm text-red-700">
            {errorMessages[error] || "Sign-in failed. Please try again."}
            {error === "not_authorized" && login && (
              <span className="block mt-1 text-red-500">
                Signed in as @{login}.
              </span>
            )}
          </div>
        )}

        <button
          type="button"
          onClick={handleGithubLogin}
          className="w-full flex items-center justify-center gap-2 px-4 py-2 text-white bg-gray-900 rounded-lg hover:bg-black focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-opacity-75"
        >
          <FaGithub className="h-5 w-5" />
          Continue with GitHub
        </button>

        <p className="text-xs text-gray-400 mt-4 text-center">
          New accounts require admin approval before access is granted.
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
