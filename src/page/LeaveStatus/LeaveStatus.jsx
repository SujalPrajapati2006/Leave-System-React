import { useState } from "react";
import "./LeaveStatus.css";

// ─── Icons ────────────────────────────────────────────────────────────────────
const Icon = ({ d, size = 16, stroke = "currentColor", fill = "none" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={fill} stroke={stroke}
    strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    {Array.isArray(d) ? d.map((p, i) => <path key={i} d={p} />) : <path d={d} />}
  </svg>
);

const SearchIcon = () => <Icon d={["M11 19a8 8 0 100-16 8 8 0 000 16z", "M21 21l-4.35-4.35"]} />;
const XIcon     = () => <Icon d={["M18 6L6 18", "M6 6l12 12"]} />;

const STATUS_LABEL = {
  pending:   "Pending",
  approved:  "Approved",
  rejected:  "Rejected",
  cancelled: "Cancelled",
};

const MOCK_LEAVES = [
  { id: "LV-001", type: "Casual Leave",  from: "2025-06-10", to: "2025-06-12", days: 3,   status: "approved",  reason: "Family function" },
  { id: "LV-002", type: "Sick Leave",    from: "2025-07-01", to: "2025-07-02", days: 2,   status: "pending",   reason: "Fever" },
  { id: "LV-003", type: "Earned Leave",  from: "2025-08-14", to: "2025-08-18", days: 5,   status: "approved",  reason: "Annual vacation" },
  { id: "LV-004", type: "Comp Off",      from: "2025-05-05", to: "2025-05-05", days: 1,   status: "rejected",  reason: "Personal work" },
  { id: "LV-005", type: "Casual Leave",  from: "2025-04-20", to: "2025-04-20", days: 1,   status: "cancelled", reason: "Medical appointment" },
];

export default function LeaveStatus() {
  const [leaves, setLeaves] = useState(MOCK_LEAVES);
  const [filter, setFilter]  = useState("all");
  const [search, setSearch]  = useState("");

  const filtered = leaves
    .filter(l => filter === "all" || l.status === filter)
    .filter(l =>
      l.type.toLowerCase().includes(search.toLowerCase()) ||
      l.id.toLowerCase().includes(search.toLowerCase())
    );

  const cancelLeave = (id) =>
    setLeaves(prev => prev.map(l => l.id === id ? { ...l, status: "cancelled" } : l));

  const fmt = d =>
    new Date(d).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });

  return (
    <div className="ls-container">
      {/* Filter Bar */}
      <div className="ls-filter-bar">
        {["all", "pending", "approved", "rejected", "cancelled"].map(f => (
          <button
            key={f}
            className={`ls-filter-btn${filter === f ? " active" : ""}`}
            onClick={() => setFilter(f)}
          >
            {f}
          </button>
        ))}

        <div className="ls-search-wrap">
          <span className="ls-search-icon"><SearchIcon /></span>
          <input
            className="ls-search-input"
            placeholder="Search leave…"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
          {search && (
            <button className="ls-search-clear" onClick={() => setSearch("")}>
              <XIcon />
            </button>
          )}
        </div>
      </div>

      {/* Leave Cards */}
      <div className="ls-leave-list">
        {filtered.length === 0 ? (
          <div className="ls-empty">
            <div className="ls-empty-icon">📋</div>
            <div className="ls-empty-text">No leave requests found</div>
          </div>
        ) : (
          filtered.map((leave, idx) => (
            <div
              className="ls-leave-card"
              key={leave.id}
              style={{ animationDelay: `${idx * 0.06}s` }}
            >
              <div className="ls-lc-top">
                <div>
                  <div className="ls-lc-type">{leave.type}</div>
                  <div className="ls-lc-id">{leave.id}</div>
                </div>
                <span className={`ls-badge ls-badge--${leave.status}`}>
                  {STATUS_LABEL[leave.status]}
                </span>
              </div>

              <div className="ls-lc-meta">
                <span className="ls-lc-meta-item"><strong>From:</strong> {fmt(leave.from)}</span>
                <span className="ls-lc-meta-item"><strong>To:</strong> {fmt(leave.to)}</span>
                <span className="ls-lc-meta-item"><strong>Days:</strong> {leave.days}</span>
              </div>

              <div className="ls-lc-reason">{leave.reason}</div>

              {leave.status === "pending" && (
                <button className="ls-cancel-btn" onClick={() => cancelLeave(leave.id)}>
                  Cancel Request
                </button>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}