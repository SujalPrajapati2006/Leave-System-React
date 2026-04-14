import LoginPage from "./components/LoginPage";
import SignUpPage from "./components/SignUpPage";
import DashboardPage from "./page/Dashboard";
import OAuthSuccess from "./components/OAuthSuccess";
import ApplyLeave from "./page/ApplyLeave";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignUpPage/>} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/oauth-success" element={<OAuthSuccess />} />
        <Route path="/apply-leave" element={<ApplyLeave />} />
      </Routes>
    </BrowserRouter>
  );
}
