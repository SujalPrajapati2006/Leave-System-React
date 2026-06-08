import React, { useState } from "react";
import "./EmployeeManagement.css";

// ─── Designation → Org + Leave mapping ───────────────────────────────────────
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
  "Finance Executive": {
    department: "Finance",
    leavePolicy: "Corporate 2025",
    leaves: [
      { type: "Annual Leave", days: 18 },
      { type: "Sick Leave", days: 12 },
      { type: "Casual Leave", days: 6 },
      { type: "Comp Off", days: 2 },
    ],
  },
};

// ─── SVG icons keyed by leave type (fallback for unknown types) ───────────────
const LEAVE_ICONS = {
  "Annual Leave": (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="3" y="4" width="18" height="18" rx="2" />
      <line x1="16" y1="2" x2="16" y2="6" />
      <line x1="8" y1="2" x2="8" y2="6" />
      <line x1="3" y1="10" x2="21" y2="10" />
    </svg>
  ),
  "Sick Leave": (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
    </svg>
  ),
  "Casual Leave": (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="12" r="10" />
      <line x1="12" y1="8" x2="12" y2="12" />
      <line x1="12" y1="16" x2="12.01" y2="16" />
    </svg>
  ),
  "Comp Off": (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
      <polyline points="17 6 23 6 23 12" />
    </svg>
  ),
  // Generic fallback icon for any future leave types
  _default: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    </svg>
  ),
};

const getLeaveIcon = (type) => LEAVE_ICONS[type] ?? LEAVE_ICONS["_default"];

// ─── Inline SVG helpers ───────────────────────────────────────────────────────
const IconUser = () => (
  <svg className="em-input-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </svg>
);

const IconEmail = () => (
  <svg className="em-input-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <rect x="2" y="4" width="20" height="16" rx="2" />
    <path d="m2 7 10 7 10-7" />
  </svg>
);

const IconPhone = () => (
  <svg className="em-input-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.6 1.27h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L7.91 9a16 16 0 0 0 6 6l1.27-.85a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
  </svg>
);

const IconCalendar = () => (
  <svg className="em-input-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <rect x="3" y="4" width="18" height="18" rx="2" />
    <line x1="16" y1="2" x2="16" y2="6" />
    <line x1="8" y1="2" x2="8" y2="6" />
    <line x1="3" y1="10" x2="21" y2="10" />
  </svg>
);

const IconBriefcase = () => (
  <svg className="em-select-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <rect x="2" y="7" width="20" height="14" rx="2" />
    <path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2" />
  </svg>
);

const IconBuilding = () => (
  <svg className="em-input-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
    <polyline points="9 22 9 12 15 12 15 22" />
  </svg>
);

const IconShield = () => (
  <svg className="em-input-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
  </svg>
);

const IconCheck = ({ size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

const IconBell = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
    <path d="M13.73 21a2 2 0 0 1-3.46 0" />
  </svg>
);

const IconProfile = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </svg>
);

const IconDots = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="12" cy="12" r="1" />
    <circle cx="19" cy="12" r="1" />
    <circle cx="5" cy="12" r="1" />
  </svg>
);

const IconAddEmployee = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
    <circle cx="9" cy="7" r="4" />
    <line x1="19" y1="8" x2="19" y2="14" />
    <line x1="22" y1="11" x2="16" y2="11" />
  </svg>
);

const IconEmptyState = () => (
  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <rect x="3" y="4" width="18" height="18" rx="2" />
    <line x1="16" y1="2" x2="16" y2="6" />
    <line x1="8" y1="2" x2="8" y2="6" />
    <line x1="3" y1="10" x2="21" y2="10" />
    <line x1="9" y1="15" x2="15" y2="15" />
  </svg>
);

const IconView = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
);

const IconRefresh = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <polyline points="1 4 1 10 7 10" />
    <path d="M3.51 15a9 9 0 1 0 .49-3.69" />
  </svg>
);

// ─── Toast notification component ─────────────────────────────────────────────
const Toast = ({ message, type = "success", onClose }) => (
  <div className={`em-toast em-toast-${type}`}>
    <span className="em-toast-icon">
      {type === "success" ? <IconCheck size={14} /> : "⚠"}
    </span>
    <span className="em-toast-message">{message}</span>
    <button className="em-toast-close" onClick={onClose}>×</button>
  </div>
);

// ─── Success modal component ──────────────────────────────────────────────────
const SuccessModal = ({ employeeId, onViewEmployee, onCreateAnother }) => (
  <div className="em-modal-overlay">
    <div className="em-modal">
      <div className="em-modal-icon">
        <IconCheck size={28} />
      </div>
      <h2 className="em-modal-title">Employee Created Successfully!</h2>
      <p className="em-modal-sub">The employee has been onboarded and all allocations have been set.</p>
      <div className="em-modal-id-row">
        <span className="em-modal-id-label">Employee ID</span>
        <span className="em-modal-id-value">{employeeId}</span>
      </div>
      <div className="em-modal-actions">
        <button className="em-modal-btn em-modal-btn-secondary" onClick={onCreateAnother}>
          <IconRefresh />
          Create Another Employee
        </button>
        <button className="em-modal-btn em-modal-btn-primary" onClick={onViewEmployee}>
          <IconView />
          View Employee
        </button>
      </div>
    </div>
  </div>
);

// ─── Main component ───────────────────────────────────────────────────────────
export default function EmployeeManagement() {
  const [formData, setFormData] = useState({
    fullName: "",
    officialEmail: "",
    phoneNumber: "",
    dateOfJoining: "",
    employmentType: "",
    designation: "",
  });

  const [loadingDesignation, setLoadingDesignation] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [resolved, setResolved] = useState(null); // { department, leavePolicy, leaves }
  const [toast, setToast] = useState(null);        // { message, type }
  const [successModal, setSuccessModal] = useState(null); // { employeeId }
  const [errors, setErrors] = useState({});

  const showToast = (message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

  // ── Field change handler ──
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  // ── Designation change — triggers auto-fill ──
  const handleDesignationChange = (e) => {
    const value = e.target.value;
    setFormData((prev) => ({ ...prev, designation: value }));
    setResolved(null);
    if (errors.designation) setErrors((prev) => ({ ...prev, designation: "" }));

    if (!value) return;

    setLoadingDesignation(true);
    // Simulate API call delay
    setTimeout(() => {
      setResolved(DESIGNATION_MAP[value] || null);
      setLoadingDesignation(false);
    }, 500);
  };

  // ── Validation ──
  const validate = () => {
    const newErrors = {};
    if (!formData.fullName.trim()) newErrors.fullName = "Full name is required";
    if (!formData.officialEmail.trim()) {
      newErrors.officialEmail = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.officialEmail)) {
      newErrors.officialEmail = "Enter a valid email address";
    }
    if (!formData.phoneNumber.trim()) newErrors.phoneNumber = "Phone number is required";
    if (!formData.dateOfJoining) newErrors.dateOfJoining = "Date of joining is required";
    if (!formData.employmentType) newErrors.employmentType = "Employment type is required";
    if (!formData.designation) newErrors.designation = "Designation is required";
    return newErrors;
  };

  // ── Form submit ──
  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = validate();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      showToast("Please fill all required fields.", "error");
      return;
    }
    if (!resolved) {
      showToast("Designation data not loaded yet.", "error");
      return;
    }

    setSubmitting(true);
    // Simulate API call
    setTimeout(() => {
      const empId = "EMP" + String(Math.floor(10000 + Math.random() * 90000)).slice(0, 5);
      setSubmitting(false);
      setSuccessModal({ employeeId: empId });
    }, 1800);
  };

  // ── Reset for "Create Another" ──
  const resetForm = () => {
    setFormData({
      fullName: "",
      officialEmail: "",
      phoneNumber: "",
      dateOfJoining: "",
      employmentType: "",
      designation: "",
    });
    setResolved(null);
    setErrors({});
    setSuccessModal(null);
  };

  const isFormReady =
    formData.fullName.trim() &&
    formData.officialEmail.trim() &&
    formData.phoneNumber.trim() &&
    formData.dateOfJoining &&
    formData.employmentType &&
    formData.designation &&
    resolved;

  return (
    <div className="em-main">
      {/* ── Toast ── */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      {/* ── Success Modal ── */}
      {successModal && (
        <SuccessModal
          employeeId={successModal.employeeId}
          onViewEmployee={() => {
            setSuccessModal(null);
            showToast(`Navigating to ${successModal.employeeId}…`);
          }}
          onCreateAnother={resetForm}
        />
      )}

      {/* ── Page Header ── */}
      <header className="em-header">
        <div>
          <h1 className="em-page-title">Add New Employee</h1>
          <p className="em-page-sub">Create and onboard a new employee profile</p>
        </div>
        <div className="em-header-actions">
          <button className="em-icon-btn" aria-label="Notifications">
            <IconBell />
          </button>
          <button className="em-icon-btn" aria-label="Profile">
            <IconProfile />
          </button>
          <button className="em-icon-btn" aria-label="More options">
            <IconDots />
          </button>
        </div>
      </header>

      {/* ── Main Card ── */}
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

          {/* ══════════════ SECTION 1: Employee Information ══════════════ */}
          <div className="em-section-header">
            <span className="em-step-num">1</span>
            <div>
              <span className="em-step-title">Employee Information</span>
              <span className="em-step-hint">Required fields to create the employee profile</span>
            </div>
          </div>

          {/* Row 1: Full Name · Official Email · Phone Number */}
          <div className="em-form-grid em-grid-3">
            {/* Full Name */}
            <div className={`em-field${errors.fullName ? " em-field-error" : ""}`}>
              <label className="em-label" htmlFor="fullName">
                Full Name <span className="em-required">*</span>
              </label>
              <div className="em-input-wrap">
                <IconUser />
                <input
                  className="em-input"
                  id="fullName"
                  type="text"
                  name="fullName"
                  placeholder="John Doe"
                  value={formData.fullName}
                  onChange={handleChange}
                  autoComplete="name"
                />
              </div>
              {errors.fullName && <span className="em-error-msg">{errors.fullName}</span>}
            </div>

            {/* Official Email */}
            <div className={`em-field${errors.officialEmail ? " em-field-error" : ""}`}>
              <label className="em-label" htmlFor="officialEmail">
                Official Email <span className="em-required">*</span>
              </label>
              <div className="em-input-wrap">
                <IconEmail />
                <input
                  className="em-input"
                  id="officialEmail"
                  type="email"
                  name="officialEmail"
                  placeholder="john.doe@company.com"
                  value={formData.officialEmail}
                  onChange={handleChange}
                  autoComplete="email"
                />
              </div>
              {errors.officialEmail && <span className="em-error-msg">{errors.officialEmail}</span>}
            </div>

            {/* Phone Number */}
            <div className={`em-field${errors.phoneNumber ? " em-field-error" : ""}`}>
              <label className="em-label" htmlFor="phoneNumber">
                Phone Number <span className="em-required">*</span>
              </label>
              <div className="em-input-wrap">
                <IconPhone />
                <input
                  className="em-input"
                  id="phoneNumber"
                  type="tel"
                  name="phoneNumber"
                  placeholder="+91 9876543210"
                  value={formData.phoneNumber}
                  onChange={handleChange}
                  autoComplete="tel"
                />
              </div>
              {errors.phoneNumber && <span className="em-error-msg">{errors.phoneNumber}</span>}
            </div>
          </div>

          {/* Row 2: Date of Joining · Employment Type · Designation */}
          <div className="em-form-grid em-grid-3">
            {/* Date of Joining */}
            <div className={`em-field${errors.dateOfJoining ? " em-field-error" : ""}`}>
              <label className="em-label" htmlFor="dateOfJoining">
                Date of Joining <span className="em-required">*</span>
              </label>
              <div className="em-input-wrap">
                <IconCalendar />
                <input
                  className="em-input"
                  id="dateOfJoining"
                  type="date"
                  name="dateOfJoining"
                  value={formData.dateOfJoining}
                  onChange={handleChange}
                />
              </div>
              {errors.dateOfJoining && <span className="em-error-msg">{errors.dateOfJoining}</span>}
            </div>

            {/* Employment Type */}
            <div className={`em-field${errors.employmentType ? " em-field-error" : ""}`}>
              <label className="em-label" htmlFor="employmentType">
                Employment Type <span className="em-required">*</span>
              </label>
              <div className="em-select-wrap">
                <IconBriefcase />
                <select
                  className="em-select"
                  id="employmentType"
                  name="employmentType"
                  value={formData.employmentType}
                  onChange={handleChange}
                >
                  <option value="">Select type</option>
                  <option value="Permanent">Permanent</option>
                  <option value="Contract">Contract</option>
                  <option value="Intern">Intern</option>
                  <option value="Probation">Probation</option>
                  <option value="Consultant">Consultant</option>
                </select>
              </div>
              {errors.employmentType && <span className="em-error-msg">{errors.employmentType}</span>}
            </div>

            {/* Designation */}
            <div className={`em-field${errors.designation ? " em-field-error" : ""}`}>
              <label className="em-label" htmlFor="designation">
                Designation <span className="em-required">*</span>
              </label>
              <div className="em-select-wrap">
                <IconBriefcase />
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
              {errors.designation && <span className="em-error-msg">{errors.designation}</span>}
            </div>
          </div>

          {/* ══════════════ SECTION 2: Organization Assignment ══════════════ */}
          <div className="em-section-header em-section-header-mt">
            <span className="em-step-num">2</span>
            <div>
              <span className="em-step-title">Organization Assignment</span>
              <span className="em-step-hint">Automatically populated based on designation</span>
            </div>
          </div>

          <div className="em-form-grid em-grid-2">
            {/* Department (read-only) */}
            <div className="em-field">
              <label className="em-label">
                Department
                <span className="em-auto-tag">auto-filled</span>
              </label>
              <div className="em-input-wrap">
                <IconBuilding />
                {loadingDesignation ? (
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

            {/* Leave Policy (read-only) */}
            <div className="em-field">
              <label className="em-label">
                Leave Policy
                <span className="em-auto-tag">auto-filled</span>
              </label>
              <div className="em-input-wrap">
                <IconShield />
                {loadingDesignation ? (
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

          {/* ══════════════ SECTION 3: Leave Allocation Preview ══════════════ */}
          <div className="em-section-header em-section-header-mt">
            <span className="em-step-num">3</span>
            <div>
              <span className="em-step-title">Leave Allocation Preview</span>
              <span className="em-step-hint">Leave entitlements assigned from the mapped policy</span>
            </div>
          </div>

          {/* Leave Allocation Area */}
          {loadingDesignation ? (
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
                <IconCheck size={13} />
                Loaded from policy: <strong>{resolved.leavePolicy}</strong>
              </div>
              <div className="em-leave-grid">
                {resolved.leaves.map((leave) => (
                  <div key={leave.type} className="em-leave-card">
                    <div className="em-leave-icon">{getLeaveIcon(leave.type)}</div>
                    <div className="em-leave-num">{leave.days}</div>
                    <div className="em-leave-unit">days</div>
                    <div className="em-leave-type">{leave.type}</div>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className="em-empty-state">
              <IconEmptyState />
              <p>Select a designation to preview leave allocations</p>
            </div>
          )}

          {/* ══════════════ Submit ══════════════ */}
          <div className="em-submit-row">
            <button
              type="submit"
              className={`em-submit-btn${!isFormReady || submitting ? " em-submit-disabled" : ""}`}
              disabled={!isFormReady || submitting}
            >
              {submitting ? (
                <>
                  <span className="em-spinner" />
                  Creating Employee…
                </>
              ) : (
                <>
                  <IconAddEmployee />
                  Create Employee
                </>
              )}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}