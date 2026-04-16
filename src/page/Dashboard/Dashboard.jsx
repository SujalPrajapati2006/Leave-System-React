import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import NotificationBell from "../../components/layout/NotificationBell";
import ApplyLeave from "../ApplyLeave/ApplyLeave";
import LeaveStatus from "../LeaveStatus/LeaveStatus";
import LeaveHistory from "../LeaveHistory/LeaveHistory";
import "./Dashboard.css";

const CircleProgress = ({ percent, color, size = 56, stroke = 4 }) => {
  const r = (size - stroke) / 2;
  const circ = 2 * Math.PI * r;
  const offset = circ - (percent / 100) * circ;
  return (
    <svg width={size} height={size} style={{ transform: "rotate(-90deg)" }}>
      <circle
        cx={size / 2} cy={size / 2} r={r}
        fill="none" stroke="#ffffff10" strokeWidth={stroke}
      />
      <circle
        cx={size / 2} cy={size / 2} r={r}
        fill="none"
        stroke={color}
        strokeWidth={stroke}
        strokeDasharray={circ}
        strokeDashoffset={offset}
        strokeLinecap="round"
        style={{ transition: "stroke-dashoffset 1s ease" }}
      />
    </svg>
  );
};

function StatCard({ label, value, color, percent, animated }) {
  return (
    <div className="stat-card">
      <div style={{ flex: 1 }}>
        <div className="stat-label">{label}</div>
        <div className="stat-value" style={{ color }}>{value}</div>
        <div className="stat-unit">Days</div>
      </div>
      <div style={{ position: "relative", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <CircleProgress percent={animated ? percent : 0} color={color} size={60} stroke={5} />
        <span style={{ position: "absolute", fontSize: 9, color, fontWeight: 700 }}>{percent}%</span>
      </div>
    </div>
  );
}

export default function Dashboard() {
  const navigate = useNavigate();
  const [activeMenu, setActiveMenu] = useState("home");
  const [animated, setAnimated] = useState(false);
  const [user, setUser] = useState({
    name: "John Doe",
    employeeId: "hx170000",
    role: "Employee",
    initials: "JD",
  });

  const total = 24, taken = 15, remaining = 9;

  useEffect(() => {
    const accessToken = localStorage.getItem("accessToken");
    if (!accessToken) {
      navigate("/login");
      return;
    }
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, [navigate]);

  useEffect(() => {
    const t = setTimeout(() => setAnimated(true), 100);
    return () => clearTimeout(t);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("user");
    localStorage.removeItem("rememberMe");
    navigate("/login");
  };

  const menuSections = [
    {
      label: "MAIN",
      items: [
        { id: "home",    icon: HomeIcon,    label: "Home" },
        { id: "apply",   icon: ApplyIcon,   label: "Apply Leave" },
        { id: "status",  icon: StatusIcon,  label: "Leave Status" },
        { id: "history", icon: HistoryIcon, label: "Leave History" },
      ],
    },
    {
      label: "SUPPORT",
      items: [{ id: "support", icon: HelpIcon, label: "Help & Support" }],
    },
  ];

    const PAGE_META = {
      home:    { title: "Dashboard",     subtitle: `Welcome back, ${user.name} — here's your leave overview` },
      apply:   { title: "Apply Leave",   subtitle: "Submit your leave request" },
      status:  { title: "Leave Status",  subtitle: "Track all your leave requests" },
      history: { title: "Leave History", subtitle: "A complete record of all your past leave applications" },
      support: { title: "Help & Support",subtitle: "Get help and find answers" },
    };
  return (
    <div className="root">
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="logo">
          <div className="logo-icon">
            <CalendarIcon size={18} color="#fff" />
          </div>
          <span className="logo-text">LeaveOS</span>
        </div>

        <nav className="nav">
          {menuSections.map((section) => (
            <div key={section.label} className="nav-section">
              <span className="section-label">{section.label}</span>
              {section.items.map(({ id, icon: Icon, label }) => {
                const isActive = activeMenu === id;
                return (
                  <button
                    key={id}
                    onClick={() => setActiveMenu(id)}
                    className={`nav-btn${isActive ? " active" : ""}`}
                  >
                    <Icon size={16} color={isActive ? "#fff" : "#6b7280"} />
                    <span>{label}</span>
                    {isActive && <div className="active-dot" />}
                  </button>
                );
              })}
            </div>
          ))}
        </nav>

        <button className="logout-btn" onClick={handleLogout}>
          <LogoutIcon size={16} color="#ef4444" />
          <span>Logout</span>
        </button>
      </aside>

      {/* Main */}
      <div className="main">
        {/* Header */}
       <header className="header">
         <div>
           <h1 className="page-title">{PAGE_META[activeMenu].title}</h1>
           <p className="page-subtitle">{PAGE_META[activeMenu].subtitle}</p>
         </div>
         <div className="header-actions">
           <NotificationBell />
           <button className="icon-btn"><UserIcon size={16} color="#9ca3af" /></button>
           <button className="icon-btn"><DotsIcon size={16} color="#9ca3af" /></button>
         </div>
       </header>

        {/* Content */}
        <main className="content">
          {activeMenu === "home" && (
            <>
              {/* User Card */}
              <div className="user-card">
                <div className="avatar">{user.initials}</div>
                <div style={{ flex: 1 }}>
                  <div className="user-name">{user.name}</div>
                  <div className="user-id">{user.employeeId}</div>
                  <span className="role-badge">{user.role}</span>
                </div>
                <div className="year-badge">FY 2025–26</div>
              </div>

              {/* Leave Entitlement */}
              <div className="section-header">LEAVE ENTITLEMENT</div>
              <div className="stats-grid">
                <StatCard
                  label="Total Entitlement"
                  value={total}
                  color="#3b82f6"
                  percent={100}
                  animated={animated}
                />
                <StatCard
                  label="Leave Taken"
                  value={taken}
                  color="#f59e0b"
                  percent={Math.round((taken / total) * 100)}
                  animated={animated}
                />
                <StatCard
                  label="Remaining Balance"
                  value={String(remaining).padStart(2, "0")}
                  color="#10b981"
                  percent={Math.round((remaining / total) * 100)}
                  animated={animated}
                />
              </div>

              {/* Usage Bar */}
              <div className="usage-card">
                <div className="usage-header">
                  <span className="usage-title">Leave Usage</span>
                  <span className="usage-percent">62.5% used</span>
                </div>
                <div className="progress-track">
                  <div
                    className="progress-fill"
                    style={{ width: animated ? "62.5%" : "0%" }}
                  />
                </div>
                <div className="usage-legend">
                  <span className="legend-item">
                    <span
                      className="legend-dot"
                      style={{ background: "#3b82f6" }}
                    />
                    Remaining — {remaining} days
                  </span>
                  <span className="legend-item">
                    <span
                      className="legend-dot"
                      style={{ background: "#f59e0b" }}
                    />
                    Used — {taken} days
                  </span>
                </div>
              </div>

              {/* Apply Button */}
              <div className="apply-btn-wrapper">
                <button
                  className="apply-btn"
                  onClick={() => setActiveMenu("apply")}
                >
                  <span style={{ fontSize: 16, marginRight: 6 }}>
                    +
                  </span>
                  Apply For Leave
                </button>
              </div>
            </>
          )}

          {activeMenu === "apply" && <ApplyLeave />}

          {activeMenu === "status" && <LeaveStatus />}

          {activeMenu === "history" && <LeaveHistory />}

          {activeMenu === "support" && (
            <div style={{ padding: 24, color: "#6b7280" }}>
              Help & Support — coming soon
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

// ── Minimal SVG Icons ──
const CalendarIcon = ({ size, color }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="4" width="18" height="18" rx="2" />
    <line x1="16" y1="2" x2="16" y2="6" />
    <line x1="8" y1="2" x2="8" y2="6" />
    <line x1="3" y1="10" x2="21" y2="10" />
  </svg>
);
const HomeIcon = ({ size, color }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 9.5L12 3l9 6.5V20a1 1 0 01-1 1H4a1 1 0 01-1-1V9.5z" />
    <path d="M9 21V12h6v9" />
  </svg>
);
const ApplyIcon = ({ size, color }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
    <polyline points="14 2 14 8 20 8" />
    <line x1="12" y1="18" x2="12" y2="12" />
    <line x1="9" y1="15" x2="15" y2="15" />
  </svg>
);
const StatusIcon = ({ size, color }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" />
    <polyline points="12 6 12 12 16 14" />
  </svg>
);
const HistoryIcon = ({ size, color }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="4" width="18" height="18" rx="2" />
    <line x1="16" y1="2" x2="16" y2="6" />
    <line x1="8" y1="2" x2="8" y2="6" />
    <line x1="3" y1="10" x2="21" y2="10" />
  </svg>
);
const HelpIcon = ({ size, color }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" />
    <path d="M9.09 9a3 3 0 015.83 1c0 2-3 3-3 3" />
    <line x1="12" y1="17" x2="12.01" y2="17" />
  </svg>
);
const LogoutIcon = ({ size, color }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4" />
    <polyline points="16 17 21 12 16 7" />
    <line x1="21" y1="12" x2="9" y2="12" />
  </svg>
);
const BellIcon = ({ size, color }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9" />
    <path d="M13.73 21a2 2 0 01-3.46 0" />
  </svg>
);
const UserIcon = ({ size, color }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </svg>
);
const DotsIcon = ({ size, color }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
    <circle cx="5" cy="12" r="2" />
    <circle cx="12" cy="12" r="2" />
    <circle cx="19" cy="12" r="2" />
  </svg>
);