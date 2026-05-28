import "./AdminSidebar.css";

const navItems = [
  {
    group: "MAIN",
    items: [
      { id: "dashboard", label: "Dashboard", icon: "⊞" },
      { id: "employee-management", label: "Employee Management", icon: "👤" },
      { id: "leave-approvals", label: "Leave Approvals", icon: "✓", badge: 3 },
      { id: "reports-analytics", label: "Reports & Analytics", icon: "▦" },
      { id: "policy-config", label: "Policy Config", icon: "⚙" },
      { id: "system-settings", label: "System Settings", icon: "◎" },
    ],
  },
  {
    group: "SUPPORT",
    items: [
      { id: "help", label: "Help & Support", icon: "?" },
    ],
  },
];

export default function AdminSidebar({ activePage, setActivePage, onLogout}) {
  return (
    <aside className="admin-sidebar">
      <div className="admin-sidebar-logo">
        <div className="admin-logo-icon">📅</div>
        <span className="admin-logo-text">LeaveOS</span>
      </div>

      <nav className="admin-sidebar-nav">
        {navItems.map((group) => (
          <div key={group.group} className="admin-nav-group">
            <span className="admin-nav-group-label">{group.group}</span>
            {group.items.map((item) => (
              <button
                key={item.id}
                className={`admin-nav-item ${activePage === item.id ? "active" : ""}`}
                onClick={() => setActivePage(item.id)}
              >
                <span className="admin-nav-icon">{item.icon}</span>
                <span className="admin-nav-label">{item.label}</span>
                {item.badge && (
                  <span className="admin-nav-badge">{item.badge}</span>
                )}
              </button>
            ))}
          </div>
        ))}
      </nav>

      <button className="admin-logout-btn" onClick={onLogout}>
          <span className="logout-arrow">→</span> Logout
        </button>
    </aside>
  );
}