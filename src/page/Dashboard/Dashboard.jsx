import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import NotificationBell from "../../components/layout/NotificationBell";
import ApplyLeave from "../ApplyLeave/ApplyLeave";
import LeaveStatus from "../LeaveStatus/LeaveStatus";
import LeaveHistory from "../LeaveHistory/LeaveHistory";
import "./Dashboard.css";

// ─── Circle Progress ──────────────────────────────────────────────────────────
function CircleProgress({ percent, color, size = 60, stroke = 5 }) {
  const r    = (size - stroke) / 2;
  const circ = 2 * Math.PI * r;
  const offset = circ - (percent / 100) * circ;
  return (
    <svg width={size} height={size} style={{ transform: "rotate(-90deg)" }}>
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="var(--dash-surface2)" strokeWidth={stroke} />
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={color} strokeWidth={stroke}
        strokeDasharray={circ} strokeDashoffset={offset} strokeLinecap="round"
        style={{ transition: "stroke-dashoffset 1.1s cubic-bezier(.4,0,.2,1)" }} />
    </svg>
  );
}

function StatCard({ label, value, color, percent, animated }) {
  return (
    <div className="dash-stat-card">
      <div style={{ flex: 1 }}>
        <div className="dash-stat-label">{label}</div>
        <div className="dash-stat-num" style={{ color }}>{String(value).padStart(2, "0")}</div>
        <div className="dash-stat-unit">Days</div>
      </div>
      <div className="dash-ring-wrap">
        <CircleProgress percent={animated ? percent : 0} color={color} size={60} stroke={5} />
        <span className="dash-ring-pct" style={{ color }}>{percent}%</span>
      </div>
    </div>
  );
}

// ─── Icon Components ──────────────────────────────────────────────────────────
const Ico = ({ d, size = 16, color = "currentColor", fill = "none" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={fill} stroke={color}
    strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    {Array.isArray(d) ? d.map((p, i) => <path key={i} d={p} />) : <path d={d} />}
  </svg>
);

const CalendarIcon = ({ size = 18, color = "#fff" }) =>
  <Ico size={size} color={color} d={["M8 2v4","M16 2v4","M3 10h18","M5 4h14a2 2 0 012 2v14a2 2 0 01-2 2H5a2 2 0 01-2-2V6a2 2 0 012-2z"]} />;
const HomeIcon    = ({ size = 16, color }) => <Ico size={size} color={color} d={["M3 9.5L12 3l9 6.5V20a1 1 0 01-1 1H4a1 1 0 01-1-1V9.5z","M9 21V12h6v9"]} />;
const ApplyIcon   = ({ size = 16, color }) => <Ico size={size} color={color} d={["M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z","M14 2v6h6","M12 18v-6","M9 15h6"]} />;
const StatusIcon  = ({ size = 16, color }) => <Ico size={size} color={color} d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z M12 6v6l4 2" />;
const HistoryIcon = ({ size = 16, color }) => <Ico size={size} color={color} d={["M12 8v4l3 3","M3.05 11a9 9 0 1 0 .5-3.5","M3 4v4h4"]} />;
const HelpIcon    = ({ size = 16, color }) => <Ico size={size} color={color} d={["M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z","M9.09 9a3 3 0 015.83 1c0 2-3 3-3 3","M12 17h.01"]} />;
const LogoutIcon  = ({ size = 16, color }) => <Ico size={size} color={color} d={["M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4","M16 17l5-5-5-5","M21 12H9"]} />;
const UserIcon    = ({ size = 16, color }) => <Ico size={size} color={color} d={["M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2","M12 11a4 4 0 100-8 4 4 0 000 8z"]} />;
const DotsIcon    = ({ size = 16, color }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
    <circle cx="5" cy="12" r="2"/><circle cx="12" cy="12" r="2"/><circle cx="19" cy="12" r="2"/>
  </svg>
);
const PlusIcon = ({ size = 16, color = "#fff" }) => <Ico size={size} color={color} d={["M12 5v14","M5 12h14"]} />;

// ─── Nav Config ───────────────────────────────────────────────────────────────
const PAGE_META = {
  home:    { title: "Dashboard",      subtitle: (n) => `Welcome back, ${n} — here's your leave overview` },
  apply:   { title: "Apply Leave",    subtitle: () => "Submit your leave request" },
  status:  { title: "Leave Status",   subtitle: () => "Track all your leave requests" },
  history: { title: "Leave History",  subtitle: () => "A complete record of all your past leave applications" },
  support: { title: "Help & Support", subtitle: () => "Get help and find answers" },
};

const MENU_SECTIONS = [
  {
    label: "MAIN",
    items: [
      { id: "home",    Icon: HomeIcon,    label: "Home" },
      { id: "apply",   Icon: ApplyIcon,   label: "Apply Leave" },
      { id: "status",  Icon: StatusIcon,  label: "Leave Status",  badge: 2 },
      { id: "history", Icon: HistoryIcon, label: "Leave History" },
    ],
  },
  {
    label: "SUPPORT",
    items: [
      { id: "support", Icon: HelpIcon, label: "Help & Support" },
    ],
  },
];

const SUPPORT_CARDS = [
  { icon: "📖", title: "Documentation", desc: "Browse guides on applying leave, policies and FAQs." },
  { icon: "💬", title: "Chat Support",  desc: "Chat with HR support team during business hours." },
  { icon: "📧", title: "Email HR",      desc: "Send an email to hr@company.com for formal queries." },
  { icon: "📞", title: "Call Helpline", desc: "Reach the HR helpline at +91-80-1234-5678." },
];

// ─── Dashboard ────────────────────────────────────────────────────────────────
export default function Dashboard() {
  const navigate = useNavigate();
  const [activeMenu, setActiveMenu] = useState("home");
  const [animated,   setAnimated]   = useState(false);
  const [user, setUser] = useState({
    name: "John Doe", employeeId: "hx170000", role: "Employee", initials: "JD",
  });

  const total = 24, taken = 15, remaining = 9;

  useEffect(() => {
    const accessToken = localStorage.getItem("accessToken");
    if (!accessToken) { navigate("/login"); return; }
    const storedUser = localStorage.getItem("user");
    if (storedUser) setUser(JSON.parse(storedUser));
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

  const meta = PAGE_META[activeMenu];

  return (
    <div className="dash-root">
      {/* ── Sidebar ── */}
      <aside className="dash-sidebar">
        <div className="dash-logo">
          <div className="dash-logo-mark">
            <CalendarIcon size={16} color="#fff" />
          </div>
          <span className="dash-logo-name">LeaveOS</span>
        </div>

        <nav className="dash-nav">
          {MENU_SECTIONS.map(section => (
            <div key={section.label} className="dash-nav-section">
              <span className="dash-section-label">{section.label}</span>
              {section.items.map(({ id, Icon, label, badge }) => {
                const isActive = activeMenu === id;
                return (
                  <button
                    key={id}
                    className={`dash-nav-item${isActive ? " active" : ""}`}
                    onClick={() => setActiveMenu(id)}
                  >
                    <Icon size={16} color={isActive ? "#fff" : undefined} />
                    <span>{label}</span>
                    {badge && <span className="dash-nav-badge">{badge}</span>}
                  </button>
                );
              })}
            </div>
          ))}
        </nav>

        <div className="dash-sidebar-bottom">
          <button className="dash-logout-btn" onClick={handleLogout}>
            <LogoutIcon size={16} color="#dc2626" />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* ── Main ── */}
      <div className="dash-main-area">
        {/* Header */}
        <header className="dash-top-bar">
          <div>
            <div className="dash-page-heading">{meta.title}</div>
            <div className="dash-page-sub">{meta.subtitle(user.name)}</div>
          </div>
          <div className="dash-top-actions">
            <NotificationBell />
            <button className="dash-icon-btn"><UserIcon size={16} /></button>
            <button className="dash-icon-btn"><DotsIcon size={16} /></button>
          </div>
        </header>

        {/* Content */}
        <main className="dash-content">
          {/* ── HOME ── */}
          {activeMenu === "home" && (
            <div className="dash-fade-up">
              {/* Profile Card */}
              <div className="dash-profile-card">
                <div className="dash-avatar">{user.initials}</div>
                <div>
                  <div className="dash-profile-name">{user.name}</div>
                  <div className="dash-profile-id">{user.employeeId}</div>
                  <span className="dash-role-badge">{user.role}</span>
                </div>
                <div className="dash-fy-chip">FY 2025–26</div>
              </div>

              {/* Leave Entitlement */}
              <div className="dash-section-label">Leave Entitlement</div>
              <div className="dash-stats-row">
                <StatCard label="Total Entitlement" value={total}     color="var(--dash-accent)" percent={100}                              animated={animated} />
                <StatCard label="Leave Taken"        value={taken}     color="var(--dash-amber)"  percent={Math.round(taken/total*100)}     animated={animated} />
                <StatCard label="Remaining Balance"  value={remaining} color="var(--dash-green)"  percent={Math.round(remaining/total*100)} animated={animated} />
              </div>

              {/* Usage Card */}
              <div className="dash-usage-card">
                <div className="dash-usage-top">
                  <span className="dash-usage-title">Leave Usage</span>
                  <span className="dash-usage-pct">62.5% used</span>
                </div>
                <div className="dash-progress-track">
                  <div className="dash-progress-fill" style={{ width: animated ? "62.5%" : "0%" }} />
                </div>
                <div className="dash-usage-legend">
                  {[["var(--dash-accent)","Remaining","9 days"],["var(--dash-amber)","Used","15 days"]].map(([c, l, v]) => (
                    <span key={l} className="dash-legend-item">
                      <span className="dash-legend-dot" style={{ background: c }} />
                      {l} — <strong>{v}</strong>
                    </span>
                  ))}
                </div>
              </div>

              {/* Apply Button */}
              <div className="dash-apply-wrap">
                <button className="dash-apply-fab" onClick={() => setActiveMenu("apply")}>
                  <PlusIcon size={16} /> Apply For Leave
                </button>
              </div>
            </div>
          )}

          {activeMenu === "apply"   && <ApplyLeave />}
          {activeMenu === "status"  && <LeaveStatus />}
          {activeMenu === "history" && <LeaveHistory />}

          {/* ── SUPPORT ── */}
          {activeMenu === "support" && (
            <div className="dash-fade-up">
              <p className="dash-support-intro">Need help? Reach out through any of the channels below.</p>
              <div className="dash-support-grid">
                {SUPPORT_CARDS.map(c => (
                  <div className="dash-support-card" key={c.title}>
                    <div className="dash-sc-icon">{c.icon}</div>
                    <div className="dash-sc-title">{c.title}</div>
                    <div className="dash-sc-desc">{c.desc}</div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}