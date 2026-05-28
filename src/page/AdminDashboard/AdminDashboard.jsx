import { useState } from "react";
import "../AdminApp.css";
import "./AdminDashboard.css";

const pendingApprovals = [
  { initials: "IN", name: "Admin Name", type: "Casual Leave", date: "02 Jun 2025", days: 2 },
  { initials: "IR", name: "Admin Admin", type: "Earned Leave", date: "07 Jun 2025", days: 5 },
  { initials: "KP", name: "Kiran Patel", type: "Sick Leave", date: "10 Jun 2025", days: 1 },
  { initials: "PS", name: "Priya Sharma", type: "Comp Off", date: "12 Jun 2025", days: 1 },
  { initials: "RM", name: "Rahul Mehta", type: "Casual Leave", date: "15 Jun 2025", days: 3 },
];

function DonutChart({ pct, color, trackColor = "#f3f4f6" }) {
  const r = 28;
  const circ = 2 * Math.PI * r;
  const dash = (pct / 100) * circ;
  return (
    <div className="donut-wrap">
      <svg className="donut-svg" viewBox="0 0 72 72">
        <circle cx="36" cy="36" r={r} fill="none" stroke={trackColor} strokeWidth="7" />
        <circle
          cx="36" cy="36" r={r} fill="none"
          stroke={color} strokeWidth="7"
          strokeDasharray={`${dash} ${circ - dash}`}
          strokeLinecap="round"
        />
      </svg>
      <div className="donut-center" style={{ color }}>{pct}%</div>
    </div>
  );
}

export default function AdminDashboard() {
  const [approvals, setApprovals] = useState(pendingApprovals);
  const [toast, setToast] = useState(null);

  const handleAction = (name, action) => {
    setApprovals((prev) => prev.filter((a) => a.name !== name));
    setToast(`${action === "approve" ? "✓ Approved" : "✕ Rejected"}: ${name}`);
    setTimeout(() => setToast(null), 3000);
  };

  return (
    <div className="admin-dashboard">
      {toast && <div className={`toast ${toast.startsWith("✓") ? "toast-green" : "toast-red"}`}>{toast}</div>}

      {/* Admin Profile Card */}
      <div className="card profile-card">
        <div className="profile-left">
          <div className="profile-avatar">A</div>
          <div className="profile-info">
            <div className="profile-name">Admin</div>
            <div className="profile-id">hx170000</div>
            <span className="badge badge-teal">ADMIN</span>
          </div>
        </div>
        <div className="fy-pill">FY 2025–26</div>
      </div>

      {/* Top Stat Row */}
      <div className="stat-row">
        <div className="stat-box">
          <div className="stat-box-label">
            Total Employees
            <span className="stat-badge badge-green">Badge</span>
          </div>
          <div className="stat-box-value">36</div>
          <div className="stat-box-unit">Active headcount</div>
        </div>
        <div className="stat-box">
          <div className="stat-box-label">
            Employees Away Today
            <span className="stat-badge badge-yellow">e.g.</span>
          </div>
          <div className="stat-box-value">5</div>
          <div className="stat-box-unit">On approved leave</div>
        </div>
        <div className="stat-box">
          <div className="stat-box-label">
            Pending Approvals
          </div>
          <div className="stat-box-value" style={{ color: "#f59e0b" }}>{approvals.length}</div>
          <div className="stat-box-unit">Awaiting action</div>
        </div>
        <div className="stat-box critical-box">
          <div className="stat-box-label">Critical Staffing Alerts</div>
          <div className="critical-value">1 Dept Shortage</div>
          <div className="stat-box-unit">Engineering team below threshold</div>
        </div>
      </div>

      {/* Metric Cards Row */}
      <div className="metric-row">
        <div className="metric-card">
          <div className="metric-card-info">
            <div className="mc-label">Avg. Attendance Rate</div>
            <div className="mc-value" style={{ color: "#1a1f16" }}>78</div>
            <div className="mc-unit">Days</div>
          </div>
          <DonutChart pct={78} color="#22c55e" trackColor="#f0fdf4" />
        </div>
        <div className="metric-card">
          <div className="metric-card-info">
            <div className="mc-label">Sick Leave Utilization</div>
            <div className="mc-value" style={{ color: "#3b82f6" }}>15</div>
            <div className="mc-unit">Days</div>
          </div>
          <DonutChart pct={15} color="#3b82f6" trackColor="#eff6ff" />
        </div>
        <div className="metric-card">
          <div className="metric-card-info">
            <div className="mc-label">Annual Leave Balance</div>
            <div className="mc-value" style={{ color: "#f59e0b" }}>22</div>
            <div className="mc-unit">Days</div>
          </div>
          <DonutChart pct={22} color="#f59e0b" trackColor="#fffbeb" />
        </div>
      </div>

      {/* Pending Approvals Table */}
      <div className="card">
        <div className="section-header">
          <div>
            <div className="card-label">Critical Pending Approvals</div>
          </div>
          <span className="badge badge-yellow">{approvals.length} pending</span>
        </div>
        {approvals.length === 0 ? (
          <div className="empty-state">✓ All caught up! No pending approvals.</div>
        ) : (
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Employee</th>
                  <th>Leave Type</th>
                  <th>Date</th>
                  <th>Days</th>
                  <th style={{ textAlign: "right" }}>Action</th>
                </tr>
              </thead>
              <tbody>
                {approvals.map((row) => (
                  <tr key={row.name}>
                    <td>
                      <div className="emp-cell">
                        <div className="avatar" style={{ background: "#1a1f16", color: "white" }}>
                          {row.initials}
                        </div>
                        <span style={{ fontWeight: 500 }}>{row.name}</span>
                      </div>
                    </td>
                    <td>{row.type}</td>
                    <td style={{ color: "#6b7280" }}>{row.date}</td>
                    <td>
                      <span className="badge badge-gray">{row.days}d</span>
                    </td>
                    <td style={{ textAlign: "right" }}>
                      <div className="approve-reject-btns">
                        <button className="btn btn-approve btn-sm" onClick={() => handleAction(row.name, "approve")}>
                          ✓ Approve
                        </button>
                        <button className="btn btn-reject btn-sm" onClick={() => handleAction(row.name, "reject")}>
                          ✕ Reject
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Bottom Grid */}
      <div className="bottom-grid">
        <div className="card">
          <div className="card-label">Leave by Department</div>
          {[
            { name: "Engineering", used: 28, total: 45, color: "#3b82f6" },
            { name: "Design", used: 9, total: 18, color: "#8b5cf6" },
            { name: "Marketing", used: 15, total: 22, color: "#f59e0b" },
            { name: "Finance", used: 6, total: 14, color: "#22c55e" },
            { name: "HR", used: 3, total: 10, color: "#14b8a6" },
          ].map((d) => (
            <div key={d.name} className="dept-row">
              <div className="dept-row-top">
                <span className="dept-name">{d.name}</span>
                <span className="dept-stat">{d.used} / {d.total}d</span>
              </div>
              <div className="progress-bar">
                <div className="progress-fill" style={{ width: `${(d.used / d.total) * 100}%`, background: d.color }} />
              </div>
            </div>
          ))}
        </div>

        <div className="card">
          <div className="card-label">Today's Activity</div>
          <div className="activity-list">
            {[
              { text: "Priya Sharma's Casual Leave approved", time: "10:32 AM", color: "#22c55e" },
              { text: "New leave request from Rahul Mehta", time: "09:45 AM", color: "#f59e0b" },
              { text: "Vikram Das's Sick Leave rejected", time: "09:12 AM", color: "#ef4444" },
              { text: "Policy update: Comp Off max raised to 4d", time: "08:50 AM", color: "#3b82f6" },
              { text: "Monthly leave report generated", time: "08:00 AM", color: "#8b5cf6" },
            ].map((a, i) => (
              <div key={i} className="activity-item">
                <div className="activity-dot" style={{ background: a.color }} />
                <div className="activity-text">{a.text}</div>
                <div className="activity-time">{a.time}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}