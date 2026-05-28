import Login from "./page/auth/LoginPage";
import Signup from "./page/auth/SignUpPage";
import Dashboard from "./page/Dashboard/Dashboard";
import OAuthSuccess from "./page/auth/OAuthSuccess";
import ApplyLeave from "./page/ApplyLeave/ApplyLeave";
import AdminApp from "./page/AdminApp";
import ProtectedAdminRoute from "./routes/ProtectedAdminRoute";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />

        <Route path="/login"         element={<Login />} />
        <Route path="/signup"        element={<Signup />} />
        <Route path="/dashboard"     element={<Dashboard />} />
        <Route path="/oauth-success" element={<OAuthSuccess />} />
        <Route path="/apply-leave"   element={<ApplyLeave />} />

        <Route
          path="/admin"
          element={
            <ProtectedAdminRoute>
              <AdminApp />
            </ProtectedAdminRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}