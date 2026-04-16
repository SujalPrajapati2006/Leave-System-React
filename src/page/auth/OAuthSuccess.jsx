import React, { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Calendar, CheckCircle2, XCircle } from "lucide-react";
import "./OAuthSuccess.css";

/**
 * OAuthSuccess.jsx
 *
 * Spring Boot redirects here after successful Google OAuth:
 *   http://localhost:5173/oauth-success?token=<JWT>
 *
 * This component:
 *  1. Reads the token from the URL query param
 *  2. Persists it to localStorage (same contract as email/password login)
 *  3. Navigates to /dashboard
 *
 * If the token is missing it shows an error state and lets the user retry.
 */
export default function OAuthSuccess() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState("loading"); // "loading" | "success" | "error"
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const token = searchParams.get("token");
    const error = searchParams.get("error"); // optional – backend can pass ?error=...

    if (error) {
      setErrorMessage(decodeURIComponent(error));
      setStatus("error");
      return;
    }

    if (!token) {
      setErrorMessage("No authentication token received. Please try again.");
      setStatus("error");
      return;
    }

    try {
      // Persist token – identical contract to email/password login
      localStorage.setItem("accessToken", token);

      // Optionally decode the JWT to persist user info without an extra API call
      const payload = JSON.parse(atob(token.split(".")[1]));
      if (payload) {
        localStorage.setItem(
          "user",
          JSON.stringify({
            email: payload.sub ?? payload.email ?? "",
            fullName: payload.fullName ?? payload.name ?? "",
            role: payload.role ?? "",
          })
        );
      }
    } catch {
      // Decoding is a nice-to-have; a malformed payload is not fatal
    }

    setStatus("success");

    // Brief success flash, then navigate
    const timer = setTimeout(() => navigate("/dashboard", { replace: true }), 1800);
    return () => clearTimeout(timer);
  }, [searchParams, navigate]);

  return (
    <div className="oauth-root">
      <div className="oauth-card">
        <div className="oauth-brand">
          <div className="oauth-brand-icon">
            <Calendar size={22} color="#fff" />
          </div>
          <span className="oauth-brand-name">LeaveOS</span>
        </div>

        {status === "loading" && (
          <div className="oauth-state">
            <div className="oauth-spinner" />
            <p className="oauth-label">Completing sign‑in…</p>
          </div>
        )}

        {status === "success" && (
          <div className="oauth-state oauth-state--success">
            <CheckCircle2 size={48} className="oauth-icon oauth-icon--success" />
            <h2 className="oauth-heading">You're in!</h2>
            <p className="oauth-label">Redirecting to your dashboard…</p>
          </div>
        )}

        {status === "error" && (
          <div className="oauth-state oauth-state--error">
            <XCircle size={48} className="oauth-icon oauth-icon--error" />
            <h2 className="oauth-heading">Authentication failed</h2>
            <p className="oauth-label oauth-label--error">{errorMessage}</p>
            <button
              className="oauth-retry-btn"
              onClick={() => navigate("/login", { replace: true })}
            >
              Back to Login
            </button>
          </div>
        )}
      </div>
    </div>
  );
}