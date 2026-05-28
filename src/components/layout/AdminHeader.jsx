import "./AdminHeader.css";

const pageTitles = {
  dashboard: { title: "Admin Dashboard", sub: "Company-wide operations overview for Admin" },
  "employee-management": { title: "Employee Management", sub: "View and manage all employee records" },
  "leave-approvals": { title: "Leave Approvals", sub: "Review and action pending leave requests" },
  "reports-analytics": { title: "Reports & Analytics", sub: "Company-wide leave and attendance insights" },
  "policy-config": { title: "Policy Config", sub: "Configure leave policies and entitlements" },
  "system-settings": { title: "System Settings", sub: "Manage system preferences and access control" },
  help: { title: "Help & Support", sub: "Get help and find answers" },
};

export default function AdminHeader({ activePage }) {
  const { title, sub } = pageTitles[activePage] || {};
  return (
    <header className="admin-header">
      <div>
        <h1 className="admin-header-title">{title}</h1>
        <p className="admin-header-sub">{sub}</p>
      </div>
      <div className="admin-header-actions">
        <button className="admin-header-btn notif">
          🔔
          <span className="notif-count">5</span>
        </button>
        <button className="admin-header-btn">👤</button>
        <button className="admin-header-btn">•••</button>
      </div>
    </header>
  );
}