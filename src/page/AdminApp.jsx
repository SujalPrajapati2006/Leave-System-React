import { useState } from "react";
import { useNavigate } from "react-router-dom";
import AdminSidebar from "../components/layout/AdminSidebar";
import AdminHeader from "../components/layout/AdminHeader";
import AdminDashboard from "./AdminDashboard/AdminDashboard";
import authApi, { authState } from "../api/authApi";
import EmployeeManagement from "./EmployeeManagement/EmployeeManagement";
import EmployeeList from "./EmployeeList/EmployeeList";
import PolicyConfig from "./PolicyConfig/PolicyConfig";
import "./AdminApp.css";

// Reuse same LogoutIcon from Dashboard
const Ico = ({ d, size = 16, color = "currentColor", fill = "none" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={fill} stroke={color}
    strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    {Array.isArray(d) ? d.map((p, i) => <path key={i} d={p} />) : <path d={d} />}
  </svg>
);
const LogoutIcon = ({ size = 16, color }) =>
  <Ico size={size} color={color} d={["M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4","M16 17l5-5-5-5","M21 12H9"]} />;

export default function AdminApp() {
  const navigate = useNavigate();
  const [activePage, setActivePage] = useState("dashboard");
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [logoutLoading,   setLogoutLoading]   = useState(false);
  const [viewEmployeeId,  setViewEmployeeId]  = useState(null);

  const pages = {
      dashboard: <AdminDashboard />,
      "employee-management": (
        <EmployeeManagement
          onEmployeeCreated={(id) => {
            setViewEmployeeId(id);
            setActivePage("employee-list");
          }}
        />
      ),
      "employee-list": (
        <EmployeeList
          highlightId={viewEmployeeId}
        />
      ),
      "policy-config": <PolicyConfig />,
    };

  const handleLogout = async () => {
    setLogoutLoading(true);
    authState.isLoggingOut = true;
    try {
      await authApi.logout();
    } catch (_) {
      // proceed even if API fails
    } finally {
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      localStorage.removeItem("user");
      localStorage.removeItem("rememberMe");
      authState.isLoggingOut = false;
      navigate("/login");
    }
  };

  return (
    <div className="admin-layout">
      <AdminSidebar
        activePage={activePage}
        setActivePage={setActivePage}
        onLogout={() => setShowLogoutModal(true)}
      />
      <div className="admin-main">
        <AdminHeader activePage={activePage} />
        <div className="admin-page-content">
          {pages[activePage]}
        </div>
      </div>

      {/* ── Logout Modal ── */}
      {showLogoutModal && (
        <div className="logout-overlay" onClick={() => setShowLogoutModal(false)}>
          <div className="logout-modal" onClick={e => e.stopPropagation()}>
            <div className="logout-modal-icon">
              <LogoutIcon size={28} color="#dc2626" />
            </div>
            <h2 className="logout-modal-title">Sign out?</h2>
            <p className="logout-modal-desc">
              You'll be returned to the login screen. Any unsaved changes will be lost.
            </p>
            <div className="logout-modal-actions">
              <button
                className="logout-cancel-btn"
                onClick={() => setShowLogoutModal(false)}
                disabled={logoutLoading}
              >
                Cancel
              </button>
              <button
                className="logout-confirm-btn"
                onClick={handleLogout}
                disabled={logoutLoading}
              >
                {logoutLoading && <span className="logout-spinner" />}
                {logoutLoading ? "Signing out…" : "Yes, sign out"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}