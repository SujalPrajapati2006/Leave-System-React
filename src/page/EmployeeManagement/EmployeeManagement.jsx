import React, { useState, useEffect } from "react";
import "./EmployeeManagement.css";
import { fetchAllEmploymentTypes } from "../../api/EmploymentType";
import { fetchAllDesignations } from "../../api/Designation";
import { fetchAllDepartments } from "../../api/Department";
import { fetchPolicyById } from "../../api/LeavePolicy";
import { createEmployee } from "../../api/Employee";

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

  const [employmentTypes, setEmploymentTypes] = useState([]);
  const [loadingDesignation, setLoadingDesignation] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [resolved, setResolved] = useState(null);
  const [toast, setToast] = useState(null);
  const [successModal, setSuccessModal] = useState(null);
  const [errors, setErrors] = useState({});
  const [profilePic, setProfilePic] = useState(null);
  const [profilePreview, setProfilePreview] = useState(null);
  const [designations, setDesignations] = useState([]);
  const [activeTab, setActiveTab] = useState("add");
  const [selectedEmployee, setSelectedEmployee] = useState(null);

  useEffect(() => {
    fetchAllEmploymentTypes()
      .then(({ employmentTypes }) => setEmploymentTypes(employmentTypes))
      .catch(() => showToast("Failed to load employment types.", "error"));

    fetchAllDesignations()
      .then((data) => setDesignations(data))
      .catch(() => showToast("Failed to load designations.", "error"));
  }, []);

  const handleProfilePic = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setProfilePic(file);
    setProfilePreview(URL.createObjectURL(file));
  };

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

 const handleDesignationChange = async (e) => {
   const value = e.target.value;
   setFormData((prev) => ({ ...prev, designation: value }));
   setResolved(null);
   if (errors.designation) setErrors((prev) => ({ ...prev, designation: "" }));

   if (!value) return;

   const selected = designations.find((d) => String(d.id) === String(value));
   if (!selected) return;

   setLoadingDesignation(true);
   try {
     // Step 1: get department to find leavePolicyId
     const departments = await fetchAllDepartments();
     const dept = departments.find((d) => String(d.id) === String(selected.departmentId));

     if (!dept || !dept.leavePolicyId) {
       setResolved({ department: selected.department, leavePolicy: "—", leaves: [] });
       return;
     }

     // Step 2: fetch the actual policy with allocations
     const policy = await fetchPolicyById(dept.leavePolicyId);

     setResolved({
       department: selected.department,
       leavePolicy: policy.name,
       leaves: policy.allocations.map((a) => ({
         type: a.leaveTypeName,
         days: a.days,
       })),
     });
   } catch {
     showToast("Failed to load designation details.", "error");
     setResolved(null);
   } finally {
     setLoadingDesignation(false);
   }
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

 const handleSubmit = async (e) => {
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
   try {
       const created = await createEmployee(formData, profilePic);

       // ✅ Clear profile pic immediately after successful upload
       setProfilePic(null);
       setProfilePreview(null);

       setSuccessModal({ employeeId: created.employeeId, id: created.id });
       showToast("Employee created successfully!", "success");
     } catch (err) {
       const message =
         err?.response?.data?.message ||
         err?.response?.data?.error ||
         "Failed to create employee. Please try again.";
       showToast(message, "error");
     } finally {
       setSubmitting(false);
     }
   };

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
    setProfilePic(null);        // ✅ clear file
    setProfilePreview(null);    // ✅ clear preview
  };

  const getLeaveIcon = (type = "") => {
    const t = type.toLowerCase();
    if (t.includes("sick"))    return "🤒";
    if (t.includes("casual"))  return "☀️";
    if (t.includes("earned") || t.includes("annual")) return "🏖️";
    if (t.includes("maternity") || t.includes("paternity")) return "👶";
    return "📅";
  };

  const isFormReady =
    formData.fullName.trim() &&
    formData.officialEmail.trim() &&
    formData.phoneNumber.trim() &&
    formData.dateOfJoining &&
    formData.employmentType &&
    formData.designation;

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

      <div className="em-card">

        <form onSubmit={handleSubmit} noValidate>

          <div className="em-section-header">
            <span className="em-step-num">1</span>
            <div>
              <span className="em-step-title">Employee Information</span>
              <span className="em-step-hint">Required fields to create the employee profile</span>
            </div>
          </div>

          <div className="em-avatar-upload">
            <div className="em-avatar-circle">
              {profilePreview
                ? <img src={profilePreview} alt="Profile" className="em-avatar-img" />
                : <span className="em-avatar-initial">
                    {formData.fullName?.[0]?.toUpperCase() || (
                      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.5">
                        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                        <circle cx="12" cy="7" r="4"/>
                      </svg>
                    )}
                  </span>
              }
              <label className="em-avatar-overlay" htmlFor="em-profile-pic" title="Upload photo">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                  <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/>
                  <circle cx="12" cy="13" r="4"/>
                </svg>
                <span>Change</span>
              </label>
              <input
                id="em-profile-pic"
                type="file"
                accept="image/*"
                className="em-avatar-file-input"
                onChange={handleProfilePic}
              />
            </div>

            <div className="em-avatar-info">
              <p className="em-avatar-title">Profile Photo</p>
              <div className="em-avatar-actions">
                <label htmlFor="em-profile-pic" className="em-avatar-btn em-avatar-btn-upload">
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                    <polyline points="17 8 12 3 7 8"/>
                    <line x1="12" y1="3" x2="12" y2="15"/>
                  </svg>
                  {profilePreview ? "Change Photo" : "Upload Photo"}
                </label>
                {profilePreview && (
                  <button
                    type="button"
                    className="em-avatar-btn em-avatar-btn-remove"
                    onClick={() => { setProfilePic(null); setProfilePreview(null); }}
                  >
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <polyline points="3 6 5 6 21 6"/>
                      <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/>
                      <path d="M10 11v6M14 11v6"/>
                    </svg>
                    Remove
                  </button>
                )}
              </div>
            </div>
          </div>

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
                   min={new Date().toISOString().split("T")[0]}
                />
              </div>
              {errors.dateOfJoining && <span className="em-error-msg">{errors.dateOfJoining}</span>}
            </div>

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
                  {employmentTypes.map((et) => (
                    <option key={et.id} value={et.id}>
                      {et.name}
                    </option>
                  ))}
                </select>
              </div>
              {errors.employmentType && <span className="em-error-msg">{errors.employmentType}</span>}
            </div>

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
                  {designations.map((d) => (
                    <option key={d.id} value={d.id}>
                      {d.name}
                    </option>
                  ))}
                </select>
              </div>
              {errors.designation && <span className="em-error-msg">{errors.designation}</span>}
            </div>
          </div>

          <div className="em-section-header em-section-header-mt">
            <span className="em-step-num">2</span>
            <div>
              <span className="em-step-title">Organization Assignment</span>
              <span className="em-step-hint">Automatically populated based on designation</span>
            </div>
          </div>

          <div className="em-form-grid em-grid-2">
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

          <div className="em-section-header em-section-header-mt">
            <span className="em-step-num">3</span>
            <div>
              <span className="em-step-title">Leave Allocation Preview</span>
              <span className="em-step-hint">Leave entitlements assigned from the mapped policy</span>
            </div>
          </div>

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