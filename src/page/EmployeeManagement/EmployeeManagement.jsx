import React, { useState } from "react";
import "./EmployeeManagement.css";

const DESIGNATION_MAP = {
  "Software Engineer": {
    department: "Engineering",
    leavePolicy: "Corporate 2025",
    leaves: [
      { type: "Annual Leave", days: 18 },
      { type: "Sick Leave", days: 12 },
      { type: "Casual Leave", days: 6 },
      { type: "Comp Off", days: 2 },
    ],
  },
  "Senior Software Engineer": {
    department: "Engineering",
    leavePolicy: "Corporate 2025",
    leaves: [
      { type: "Annual Leave", days: 20 },
      { type: "Sick Leave", days: 12 },
      { type: "Casual Leave", days: 8 },
      { type: "Comp Off", days: 4 },
    ],
  },
  "QA Engineer": {
    department: "Quality Assurance",
    leavePolicy: "Corporate 2025",
    leaves: [
      { type: "Annual Leave", days: 18 },
      { type: "Sick Leave", days: 12 },
      { type: "Casual Leave", days: 6 },
      { type: "Comp Off", days: 2 },
    ],
  },
  "QA Lead": {
    department: "Quality Assurance",
    leavePolicy: "Corporate 2025",
    leaves: [
      { type: "Annual Leave", days: 20 },
      { type: "Sick Leave", days: 14 },
      { type: "Casual Leave", days: 8 },
      { type: "Comp Off", days: 4 },
    ],
  },
  "HR Executive": {
    department: "Human Resources",
    leavePolicy: "HR Policy 2025",
    leaves: [
      { type: "Annual Leave", days: 21 },
      { type: "Sick Leave", days: 14 },
      { type: "Casual Leave", days: 7 },
      { type: "Comp Off", days: 3 },
    ],
  },
};

const LEAVE_ICONS = {
  "Annual Leave": (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="3" y="4" width="18" height="18" rx="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" />
    </svg>
  ),
  "Sick Leave": (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
    </svg>
  ),
  "Casual Leave": (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
    </svg>
  ),
  "Comp Off": (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" /><polyline points="17 6 23 6 23 12" />
    </svg>
  ),
};

export default function EmployeeManagement() {
  const [formData, setFormData] = useState({
    fullName: "",
    officialEmail: "",
    dateOfJoining: "",
    designation: "",
  });
  const [loading, setLoading] = useState(false);
  const [resolved, setResolved] = useState(null); // { department, leavePolicy, leaves }
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleDesignationChange = (e) => {
    const value = e.target.value;
    setFormData((prev) => ({ ...prev, designation: value }));
    setResolved(null);

    if (!value) return;

    setLoading(true);
    setTimeout(() => {
      setResolved(DESIGNATION_MAP[value] || null);
      setLoading(false);
    }, 420);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.designation || !resolved) return;
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 3000);
  };

  const isValid =
    formData.fullName.trim() &&
    formData.officialEmail.trim() &&
    formData.dateOfJoining &&
    formData.designation &&
    resolved;

  return (
    <div className="em-main">
      {/* Page Header */}
      <header className="em-header">
        <div>
          <h1 className="em-page-title">Add New Employee</h1>
          <p className="em-page-sub">Create and onboard a new employee profile</p>
        </div>
        <div className="em-header-actions">
          <button className="em-icon-btn" aria-label="Notifications">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
              <path d="M13.73 21a2 2 0 0 1-3.46 0" />
            </svg>
          </button>
          <button className="em-icon-btn" aria-label="Profile">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
              <circle cx="12" cy="7" r="4" />
            </svg>
          </button>
          <button className="em-icon-btn" aria-label="More options">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="1" /><circle cx="19" cy="12" r="1" /><circle cx="5" cy="12" r="1" />
            </svg>
          </button>
        </div>
      </header>

      {/* Form Card */}
      <div className="em-card">
        {/* Admin Row */}
        <div className="em-admin-row">
          <div className="em-admin-info">
            <div className="em-avatar">A</div>
            <div>
              <div className="em-admin-name">Admin</div>
              <div className="em-admin-id">hx170000</div>
              <span className="em-badge-admin">ADMIN</span>
            </div>
          </div>
          <div className="em-fy-badge">FY 2025–26</div>
        </div>

        <form onSubmit={handleSubmit} noValidate>
          {/* Step 1 */}
          <div className="em-step-header">
            <span className="em-step-num">1</span>
            <span className="em-step-title">Employee Information</span>
          </div>

          <div className="em-form-grid em-grid-3">
            {/* Full Name */}
            <div className="em-field">
              <label className="em-label" htmlFor="fullName">Full Name</label>
              <div className="em-input-wrap">
                <svg className="em-input-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" />
                </svg>
                <input
                  className="em-input"
                  id="fullName"
                  type="text"
                  name="fullName"
                  placeholder="Full Name"
                  value={formData.fullName}
                  onChange={handleChange}
                />
              </div>
            </div>

            {/* Official Email */}
            <div className="em-field">
              <label className="em-label" htmlFor="officialEmail">Official Email</label>
              <div className="em-input-wrap">
                <svg className="em-input-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="2" y="4" width="20" height="16" rx="2" /><path d="m2 7 10 7 10-7" />
                </svg>
                <input
                  className="em-input"
                  id="officialEmail"
                  type="email"
                  name="officialEmail"
                  placeholder="name@company.com"
                  value={formData.officialEmail}
                  onChange={handleChange}
                />
              </div>
            </div>

            {/* Date of Joining */}
            <div className="em-field">
              <label className="em-label" htmlFor="dateOfJoining">Date of Joining</label>
              <div className="em-input-wrap">
                <svg className="em-input-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="3" y="4" width="18" height="18" rx="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" />
                </svg>
                <input
                  className="em-input"
                  id="dateOfJoining"
                  type="date"
                  name="dateOfJoining"
                  value={formData.dateOfJoining}
                  onChange={handleChange}
                />
              </div>
            </div>
          </div>

          {/* Designation + Auto-filled fields */}
          <div className="em-form-grid em-grid-3">
            {/* Designation */}
            <div className="em-field">
              <label className="em-label" htmlFor="designation">
                Designation <span className="em-required">*</span>
              </label>
              <div className="em-select-wrap">
                <svg className="em-select-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="2" y="7" width="20" height="14" rx="2" /><path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2" />
                </svg>
                <select
                  className="em-select"
                  id="designation"
                  name="designation"
                  value={formData.designation}
                  onChange={handleDesignationChange}
                >
                  <option value="">Select designation</option>
                  {Object.keys(DESIGNATION_MAP).map((d) => (
                    <option key={d} value={d}>{d}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Department — Read Only */}
            <div className="em-field">
              <label className="em-label">
                Department
                <span className="em-auto-tag">auto-filled</span>
              </label>
              <div className="em-input-wrap">
                <svg className="em-input-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" /><polyline points="9 22 9 12 15 12 15 22" />
                </svg>
                {loading ? (
                  <div className="em-skeleton" />
                ) : (
                  <input
                    className={`em-input em-input-readonly${!resolved ? " em-input-empty" : ""}`}
                    type="text"
                    readOnly
                    value={resolved?.department || ""}
                    placeholder="Auto-populated"
                  />
                )}
              </div>
            </div>

            {/* Leave Policy — Read Only */}
            <div className="em-field">
              <label className="em-label">
                Leave Policy
                <span className="em-auto-tag">auto-filled</span>
              </label>
              <div className="em-input-wrap">
                <svg className="em-input-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                </svg>
                {loading ? (
                  <div className="em-skeleton" />
                ) : (
                  <input
                    className={`em-input em-input-readonly${!resolved ? " em-input-empty" : ""}`}
                    type="text"
                    readOnly
                    value={resolved?.leavePolicy || ""}
                    placeholder="Auto-populated"
                  />
                )}
              </div>
            </div>
          </div>

          {/* Step 2 */}
          <div className="em-step-header" style={{ marginTop: "8px" }}>
            <span className="em-step-num">2</span>
            <span className="em-step-title">Leave Allocation Preview</span>
          </div>

          {/* Leave Allocation Cards */}
          {loading ? (
            <div className="em-leave-grid">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="em-leave-card em-leave-skeleton">
                  <div className="em-skeleton em-sk-num" />
                  <div className="em-skeleton em-sk-label" />
                </div>
              ))}
            </div>
          ) : resolved ? (
            <>
              <div className="em-policy-info">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
                Loaded from policy: <strong>{resolved.leavePolicy}</strong>
              </div>
              <div className="em-leave-grid">
                {resolved.leaves.map((leave) => (
                  <div key={leave.type} className="em-leave-card">
                    <div className="em-leave-icon">{LEAVE_ICONS[leave.type]}</div>
                    <div className="em-leave-num">{leave.days}</div>
                    <div className="em-leave-unit">days</div>
                    <div className="em-leave-type">{leave.type}</div>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className="em-empty-state">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <rect x="3" y="4" width="18" height="18" rx="2" /><line x1="16" y1="2" x2="16" y2="6" />
                <line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" />
                <line x1="9" y1="15" x2="15" y2="15" />
              </svg>
              <p>Select a designation to preview leave allocations</p>
            </div>
          )}

          {/* Submit */}
          <div className="em-submit-row">
            {submitted ? (
              <div className="em-success-msg">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
                Employee profile created successfully!
              </div>
            ) : (
              <button
                type="submit"
                className={`em-submit-btn${!isValid ? " em-submit-disabled" : ""}`}
                disabled={!isValid}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                  <circle cx="9" cy="7" r="4" />
                  <line x1="19" y1="8" x2="19" y2="14" />
                  <line x1="22" y1="11" x2="16" y2="11" />
                </svg>
                Create Employee
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}