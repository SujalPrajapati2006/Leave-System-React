import { useState, useEffect } from "react";
import "./LeaveStatus.css";

const STATUS = {
  pending: "Pending",
  approved: "Approved",
  rejected: "Rejected",
  cancelled: "Cancelled",
};

const MOCK_LEAVES = [
  {
    id: "LV-001",
    type: "Casual Leave",
    from: "2025-06-10",
    to: "2025-06-12",
    days: 3,
    status: "approved",
    reason: "Family function",
  },
  {
    id: "LV-002",
    type: "Sick Leave",
    from: "2025-07-01",
    to: "2025-07-02",
    days: 2,
    status: "pending",
    reason: "Fever",
  },
];

export default function LeaveStatus() {
  const [leaves, setLeaves] = useState(MOCK_LEAVES);
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");

  const filteredLeaves = leaves
    .filter(
      (leave) =>
        filter === "all" || leave.status === filter
    )
    .filter(
      (leave) =>
        leave.type
          .toLowerCase()
          .includes(search.toLowerCase()) ||
        leave.id
          .toLowerCase()
          .includes(search.toLowerCase())
    );

  const cancelLeave = (id) => {
    setLeaves((prev) =>
      prev.map((leave) =>
        leave.id === id
          ? { ...leave, status: "cancelled" }
          : leave
      )
    );
  };

  return (
    <div className="leave-status-container">
      <div className="page-header">
        <h2>Leave Status</h2>
        <p>Track all your leave requests</p>
      </div>

      {/* Filters */}
      <div className="filters">
        {["all", "pending", "approved", "rejected", "cancelled"].map(
          (tab) => (
            <button
              key={tab}
              className={filter === tab ? "active" : ""}
              onClick={() => setFilter(tab)}
            >
              {tab}
            </button>
          )
        )}

        <input
          placeholder="Search leave..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* Leave Cards */}
      <div className="leave-list">
        {filteredLeaves.length === 0 && (
          <div className="empty">
            No Leave Found
          </div>
        )}

        {filteredLeaves.map((leave) => (
          <div key={leave.id} className="leave-card">
            <div className="leave-header">
              <div>
                <h4>{leave.type}</h4>
                <small>{leave.id}</small>
              </div>

              <span className={`status ${leave.status}`}>
                {STATUS[leave.status]}
              </span>
            </div>

            <div className="leave-body">
              <div>
                <strong>From:</strong> {leave.from}
              </div>
              <div>
                <strong>To:</strong> {leave.to}
              </div>
              <div>
                <strong>Days:</strong> {leave.days}
              </div>
            </div>

            <div className="leave-reason">
              {leave.reason}
            </div>

            {leave.status === "pending" && (
              <button
                className="cancel-btn"
                onClick={() =>
                  cancelLeave(leave.id)
                }
              >
                Cancel
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}