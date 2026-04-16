import { useState } from "react";
import "./ApplyLeave.css";

// ─── Icons ────────────────────────────────────────────────────────────────────
const Icon = ({ d, size = 16, stroke = "currentColor", fill = "none" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={fill} stroke={stroke}
    strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    {Array.isArray(d) ? d.map((p, i) => <path key={i} d={p} />) : <path d={d} />}
  </svg>
);

const CalendarIcon = () => <Icon d={["M8 2v4","M16 2v4","M3 10h18","M5 4h14a2 2 0 012 2v14a2 2 0 01-2 2H5a2 2 0 01-2-2V6a2 2 0 012-2z"]} />;
const PlusIcon     = () => <Icon d={["M12 5v14","M5 12h14"]} />;
const CheckIcon    = () => <Icon d="M20 6L9 17l-5-5" />;
const XIcon        = () => <Icon d={["M18 6L6 18","M6 6l12 12"]} />;

const LEAVE_TYPES = [
  { id: "casual",  label: "Casual Leave",  remaining: 6,  total: 12, used: 6,  color: "#3b82f6" },
  { id: "sick",    label: "Sick Leave",    remaining: 4,  total: 6,  used: 2,  color: "#8b5cf6" },
  { id: "earned",  label: "Earned Leave",  remaining: 12, total: 15, used: 3,  color: "#10b981" },
  { id: "comp",    label: "Comp Off",      remaining: 2,  total: 4,  used: 2,  color: "#f59e0b" },
];

const RECENT_LEAVES = [
  { type: "Sick Leave",    dates: "Apr 8 – Apr 9",  status: "approved" },
  { type: "Casual Leave",  dates: "Mar 21",          status: "approved" },
  { type: "Earned Leave",  dates: "May 1 – May 3",   status: "pending"  },
];

// ─── Sidebar ──────────────────────────────────────────────────────────────────
function LeaveBalanceSidebar() {
  return (
    <aside className="al-sidebar">

        {/* Quick Stats */}
              <div className="al-sidebar-card al-quick-stats">
                <h3 className="al-sidebar-title">This Month</h3>
                <div className="al-stats-grid">
                  <div className="al-stat-item">
                    <div className="al-stat-value">21</div>
                    <div className="al-stat-label">Working days</div>
                  </div>
                  <div className="al-stat-item">
                    <div className="al-stat-value">2</div>
                    <div className="al-stat-label">Holidays</div>
                  </div>
                  <div className="al-stat-item">
                    <div className="al-stat-value">1</div>
                    <div className="al-stat-label">Team on leave</div>
                  </div>
                  <div className="al-stat-item">
                    <div className="al-stat-value">3</div>
                    <div className="al-stat-label">Pending requests</div>
                  </div>
                </div>
              </div>

      {/* Leave Balance */}
      <div className="al-sidebar-card">
        <h3 className="al-sidebar-title">Leave Balance</h3>
        <div className="al-balance-list">
          {LEAVE_TYPES.map(lt => {
            const pct = Math.round((lt.remaining / lt.total) * 100);
            return (
              <div key={lt.id} className="al-bal-row">
                <div className="al-bal-header">
                  <span className="al-bal-label">{lt.label}</span>
                  <span className="al-bal-count">
                    <strong>{lt.remaining}</strong> / {lt.total}
                  </span>
                </div>
                <div className="al-bal-track">
                  <div
                    className="al-bal-fill"
                    style={{ width: `${pct}%`, background: lt.color }}
                  />
                </div>
                <div className="al-bal-meta">{lt.used} used · {lt.remaining} remaining</div>
              </div>
            );
          })}
        </div>
      </div>
    </aside>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function ApplyLeave() {
  const [form, setForm]       = useState({ leaveType: "", from: "", to: "", reason: "" });
  const [errors, setErrors]   = useState({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const set = (k, v) => {
    setForm(f => ({ ...f, [k]: v }));
    setErrors(e => ({ ...e, [k]: "" }));
  };

  const calcDays = () => {
    if (!form.from || !form.to) return 0;
    const d = (new Date(form.to) - new Date(form.from)) / 86400000 + 1;
    return d > 0 ? d : 0;
  };

  const validate = () => {
    const e = {};
    if (!form.leaveType) e.leaveType = "Please select a leave type";
    if (!form.from) e.from = "Select start date";
    if (!form.to) e.to = "Select end date";
    else if (form.from && form.to && form.to < form.from) e.to = "End date must be after start date";
    if (!form.reason.trim()) e.reason = "Please enter a reason";
    return e;
  };

  const handleSubmit = () => {
    const e = validate();
    if (Object.keys(e).length) { setErrors(e); return; }
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSuccess(true);
      setForm({ leaveType: "", from: "", to: "", reason: "" });
    }, 1200);
  };

  const days = calcDays();

  return (
    <div className="al-page-layout">
      {/* Left: Form */}
      <div className="al-form-section">
        {success && (
          <div className="al-success-banner">
            <CheckIcon />
            Leave application submitted successfully! You'll be notified once approved.
            <button className="al-close-btn" onClick={() => setSuccess(false)}>
              <XIcon />
            </button>
          </div>
        )}

        <div className="al-form-card">
          {/* Leave Type */}
          <div className="al-form-field">
            <label className="al-form-label">Leave Type</label>
            <div className="al-leave-type-grid">
              {LEAVE_TYPES.map(lt => (
                <button
                  key={lt.id}
                  className={`al-lt-btn${form.leaveType === lt.id ? " selected" : ""}`}
                  onClick={() => set("leaveType", lt.id)}
                >
                  <div className="al-lt-name">{lt.label}</div>
                  <div className="al-lt-days">{lt.remaining} days left</div>
                </button>
              ))}
            </div>
            {errors.leaveType && <div className="al-err-msg">{errors.leaveType}</div>}
          </div>

          {/* Date Row */}
          <div className="al-date-row">
            <div className="al-form-field">
              <label className="al-form-label">From</label>
              <input
                type="date"
                className={`al-form-input${errors.from ? " error" : ""}`}
                value={form.from}
                onChange={e => set("from", e.target.value)}
              />
              {errors.from && <div className="al-err-msg">{errors.from}</div>}
            </div>
            <div className="al-form-field">
              <label className="al-form-label">To</label>
              <input
                type="date"
                className={`al-form-input${errors.to ? " error" : ""}`}
                value={form.to}
                onChange={e => set("to", e.target.value)}
              />
              {errors.to && <div className="al-err-msg">{errors.to}</div>}
            </div>
          </div>

          {/* Days Preview */}
          {days > 0 && (
            <div className="al-days-preview">
              <CalendarIcon />
              <span>{days} working day{days !== 1 ? "s" : ""} selected</span>
            </div>
          )}

          {/* Reason */}
          <div className="al-form-field">
            <label className="al-form-label">Reason</label>
            <textarea
              className={`al-form-input al-form-textarea${errors.reason ? " error" : ""}`}
              placeholder="Briefly describe your reason for leave…"
              value={form.reason}
              onChange={e => set("reason", e.target.value)}
            />
            {errors.reason && <div className="al-err-msg">{errors.reason}</div>}
          </div>

          {/* Submit */}
          <button className="al-submit-btn" onClick={handleSubmit} disabled={loading}>
            {loading ? <span className="al-spinner" /> : <PlusIcon />}
            {loading ? "Submitting…" : "Submit Application"}
          </button>
        </div>
      </div>

      {/* Right: Sidebar */}
      <LeaveBalanceSidebar />
    </div>
  );
}