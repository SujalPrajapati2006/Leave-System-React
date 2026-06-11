import React, { useState, useEffect, useCallback } from "react";
import { fetchAllEmployees, updateEmployee, deleteEmployee } from "../../api/Employee";
import { fetchAllEmploymentTypes } from "../../api/EmploymentType";
import { fetchAllDesignations } from "../../api/Designation";
import "./EmployeeList.css";

// ── Icon library ───────────────────────────────────────────────────────────
const Ico = {
  Search:    () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>,
  User:      () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>,
  Email: ({ size = 13 } = {}) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="m2 7 10 7 10-7"/></svg>,
  Phone:     () => <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.6 1.27h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L7.91 9a16 16 0 0 0 6 6l1.27-.85a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>,
  Building:  () => <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>,
  Briefcase: () => <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"/></svg>,
  Calendar: ({ size = 13 } = {}) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>,
  Shield:    () => <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>,
  Close:     () => <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>,
  Edit:      () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>,
  Trash:     () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6M14 11v6"/><path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/></svg>,
  Camera:    () => <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/><circle cx="12" cy="13" r="4"/></svg>,
  ChevronDown: () => <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="6 9 12 15 18 9"/></svg>,
  Check:     () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>,
  Users:     () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>,
  Filter:    () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/></svg>,
};

// ── Avatar ─────────────────────────────────────────────────────────────────
function Avatar({ name = "", size = 40, src }) {
  const palette = ["#2e5229","#3a6b33","#1a4a36","#1e4d65","#4a3a7a","#5a3a2a"];
  const idx = name.charCodeAt(0) % palette.length;
  const initials = name.split(" ").map(w => w[0]).join("").toUpperCase().slice(0, 2) || "?";

  if (src) {
    return (
      <img
        className="el-avatar-img"
        src={src}
        alt={name}
        style={{ width: size, height: size }}
        onError={e => { e.currentTarget.style.display = "none"; }}
      />
    );
  }

  return (
    <div style={{
      width: size, height: size, borderRadius: "50%",
      background: palette[idx], color: "#fff",
      display: "flex", alignItems: "center", justifyContent: "center",
      fontSize: Math.floor(size * 0.34), fontWeight: 700, flexShrink: 0,
      letterSpacing: "0.5px",
    }}>
      {initials}
    </div>
  );
}

// ── Employment type badge ─────────────────────────────────────────────────
function TypeBadge({ label }) {
  const map = {
    "full-time": "el-type-fulltime",
    "fulltime":  "el-type-fulltime",
    "part-time": "el-type-parttime",
    "parttime":  "el-type-parttime",
    "contract":  "el-type-contract",
    "intern":    "el-type-intern",
    "probation": "el-type-probation",
  };
  const cls = map[(label || "").toLowerCase()] ?? "el-type-default";
  return <span className={`el-type-badge ${cls}`}>{label}</span>;
}

// ── Toast ──────────────────────────────────────────────────────────────────
function ToastItem({ message, type, onClose }) {
  useEffect(() => {
    const t = setTimeout(onClose, 4200);
    return () => clearTimeout(t);
  }, [onClose]);

  const Icon = type === "success"
    ? () => <Ico.Check />
    : () => <Ico.Close />;

  return (
    <div className={`el-toast el-toast-${type}`}>
      <span className={`el-toast-icon-${type}`}><Icon /></span>
      <span className="el-toast-msg">{message}</span>
      <button className="el-toast-close" onClick={onClose}>×</button>
    </div>
  );
}

// ── Skeleton card ──────────────────────────────────────────────────────────
function SkeletonCard() {
  return (
    <div className="el-card el-card-skeleton">
      <div className="el-card-body">
        <div className="el-card-top">
          <div className="el-sk el-sk-avatar" />
          <div style={{ flex: 1 }}>
            <div className="el-sk el-sk-name" />
            <div className="el-sk el-sk-sub" style={{ marginTop: 7 }} />
          </div>
        </div>
        <div className="el-card-meta" style={{ gap: 8 }}>
          <div className="el-sk el-sk-line" />
          <div className="el-sk el-sk-line" />
          <div className="el-sk el-sk-line-sm" />
        </div>
      </div>
      <div className="el-card-footer" style={{ opacity: 0.4 }}>
        <div className="el-sk" style={{ width: 70, height: 20, borderRadius: 20 }} />
        <div className="el-sk" style={{ width: 80, height: 11 }} />
      </div>
    </div>
  );
}

// ── Delete modal ───────────────────────────────────────────────────────────
function DeleteModal({ employee, onConfirm, onCancel, loading }) {
  return (
    <div className="el-modal-overlay" onClick={onCancel}>
      <div className="el-modal el-modal-delete" onClick={e => e.stopPropagation()}>
        <div className="el-modal-del-icon"><Ico.Trash /></div>
        <h3 className="el-modal-del-title">Delete Employee?</h3>
        <p className="el-modal-del-desc">
          Are you sure you want to permanently delete{" "}
          <strong>{employee.fullName}</strong>{" "}
          <span style={{ fontFamily: "var(--mono)", fontSize: 12, color: "var(--ink-4)" }}>
            ({employee.employeeId})
          </span>?{" "}
          This action cannot be undone.
        </p>
        <div className="el-modal-actions" style={{ gap: 10 }}>
          <button className="el-btn el-btn-cancel" onClick={onCancel} disabled={loading}>
            Cancel
          </button>
          <button className="el-btn el-btn-danger" onClick={onConfirm} disabled={loading}>
            {loading && <span className="el-spinner" />}
            {loading ? "Deleting…" : "Yes, Delete"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Edit modal ─────────────────────────────────────────────────────────────
function EditModal({ employee, onSave, onCancel, saving }) {
  const [form, setForm] = useState({
    fullName:         employee.fullName       ?? "",
    email:            employee.email          ?? "",
    phoneNumber:      employee.phoneNumber    ?? "",
    joiningDate:      employee.joiningDate    ?? "",
    employmentTypeId: String(employee.employmentTypeId ?? ""),
    designationId:    String(employee.designationId    ?? ""),
  });
  const [profilePic, setProfilePic]         = useState(null);
  const [profilePreview, setProfilePreview] = useState(employee.profilePicture ?? null);
  const [employmentTypes, setEmploymentTypes] = useState([]);
  const [designations, setDesignations]       = useState([]);
  const [errors, setErrors]                   = useState({});

  useEffect(() => {
    fetchAllEmploymentTypes().then(({ employmentTypes }) => setEmploymentTypes(employmentTypes)).catch(() => {});
    fetchAllDesignations().then(d => setDesignations(d)).catch(() => {});
  }, []);

  const handleChange = e => {
    const { name, value } = e.target;
    setForm(p => ({ ...p, [name]: value }));
    if (errors[name]) setErrors(p => ({ ...p, [name]: "" }));
  };

  const handlePhoto = e => {
    const file = e.target.files[0];
    if (!file) return;
    setProfilePic(file);
    setProfilePreview(URL.createObjectURL(file));
  };

  const validate = () => {
    const e = {};
    if (!form.fullName.trim())    e.fullName    = "Full name is required";
    if (!form.email.trim())       e.email       = "Email is required";
    if (!form.phoneNumber.trim()) e.phoneNumber = "Phone is required";
    if (!form.joiningDate)        e.joiningDate = "Date of joining is required";
    if (!form.employmentTypeId)   e.employmentTypeId = "Select employment type";
    if (!form.designationId)      e.designationId    = "Select designation";
    return e;
  };

  const handleSubmit = () => {
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    onSave(form, profilePic);
  };

  return (
    <div className="el-modal-overlay" onClick={onCancel}>
      <div className="el-modal el-modal-edit" onClick={e => e.stopPropagation()}>

        {/* Header */}
        <div className="el-modal-edit-header">
          <h3 className="el-modal-edit-title">Edit Employee</h3>
          <button className="el-panel-close" onClick={onCancel}><Ico.Close /></button>
        </div>

        {/* Photo */}
        <div className="el-photo-row">
          <div className="el-photo-avatar">
            <Avatar name={form.fullName} size={60} src={profilePreview} />
            <label className="el-photo-change" htmlFor="edit-photo-input" title="Change photo">
              <Ico.Camera />
            </label>
            <input id="edit-photo-input" type="file" accept="image/*" style={{ display: "none" }} onChange={handlePhoto} />
          </div>
          <div>
            <div className="el-photo-label">Profile Photo</div>
            <div className="el-photo-hint">JPEG, PNG or WebP · max 5 MB</div>
            <label htmlFor="edit-photo-input" className="el-photo-upload-btn">
              <Ico.Camera /> Change Photo
            </label>
          </div>
        </div>

        {/* Form */}
        <div className="el-form-grid">
          {/* Full Name */}
          <div className={`el-field el-field-full${errors.fullName ? " el-field-err" : ""}`}>
            <label className="el-label">Full Name *</label>
            <input className="el-input" name="fullName" value={form.fullName} onChange={handleChange} placeholder="e.g. Jane Smith" />
            {errors.fullName && <span className="el-error">{errors.fullName}</span>}
          </div>

          {/* Email */}
          <div className={`el-field${errors.email ? " el-field-err" : ""}`}>
            <label className="el-label">Email Address *</label>
            <input className="el-input" name="email" type="email" value={form.email} onChange={handleChange} placeholder="jane@company.com" />
            {errors.email && <span className="el-error">{errors.email}</span>}
          </div>

          {/* Phone */}
          <div className={`el-field${errors.phoneNumber ? " el-field-err" : ""}`}>
            <label className="el-label">Phone Number *</label>
            <input className="el-input" name="phoneNumber" value={form.phoneNumber} onChange={handleChange} placeholder="+1 555 000 0000" />
            {errors.phoneNumber && <span className="el-error">{errors.phoneNumber}</span>}
          </div>

          {/* Date of joining */}
          <div className={`el-field${errors.joiningDate ? " el-field-err" : ""}`}>
            <label className="el-label">Date of Joining *</label>
            <input className="el-input" name="joiningDate" type="date" value={form.joiningDate} onChange={handleChange} />
            {errors.joiningDate && <span className="el-error">{errors.joiningDate}</span>}
          </div>

          {/* Employment type */}
          <div className={`el-field${errors.employmentTypeId ? " el-field-err" : ""}`}>
            <label className="el-label">Employment Type *</label>
            <div className="el-select-wrap">
              <select className="el-select" name="employmentTypeId" value={form.employmentTypeId} onChange={handleChange}>
                <option value="">Select type</option>
                {employmentTypes.map(et => (
                  <option key={et.id} value={String(et.id)}>{et.name}</option>
                ))}
              </select>
              <span className="el-select-arrow"><Ico.ChevronDown /></span>
            </div>
            {errors.employmentTypeId && <span className="el-error">{errors.employmentTypeId}</span>}
          </div>

          {/* Designation */}
          <div className={`el-field${errors.designationId ? " el-field-err" : ""}`}>
            <label className="el-label">Designation *</label>
            <div className="el-select-wrap">
              <select className="el-select" name="designationId" value={form.designationId} onChange={handleChange}>
                <option value="">Select designation</option>
                {designations.map(d => (
                  <option key={d.id} value={String(d.id)}>{d.name}</option>
                ))}
              </select>
              <span className="el-select-arrow"><Ico.ChevronDown /></span>
            </div>
            {errors.designationId && <span className="el-error">{errors.designationId}</span>}
          </div>
        </div>

        {/* Footer */}
        <div className="el-modal-edit-footer">
          <button className="el-btn el-btn-cancel" onClick={onCancel} disabled={saving}>Cancel</button>
          <button className="el-btn el-btn-primary" onClick={handleSubmit} disabled={saving}>
            {saving && <span className="el-spinner" />}
            {saving ? "Saving changes…" : "Save Changes"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Detail panel ───────────────────────────────────────────────────────────
function EmployeeDetailPanel({ employee, onClose, onEdit, onDelete }) {
  if (!employee) return null;
  const leaves = employee.leavePolicy?.leaveConfigurations ?? [];

  return (
    <div className="el-panel-overlay" onClick={onClose}>
      <div className="el-panel" onClick={e => e.stopPropagation()}>

        {/* Sticky header */}
        <div className="el-panel-header">
          <h2 className="el-panel-title">Employee Details</h2>
          <button className="el-panel-close" onClick={onClose} aria-label="Close panel">
            <Ico.Close />
          </button>
        </div>

        {/* Hero */}
        <div className="el-panel-hero">
          <Avatar name={employee.fullName} size={60} src={employee.profilePicture} />
          <div className="el-panel-hero-info">
            <div className="el-panel-name">{employee.fullName}</div>
            <div className="el-panel-empid">{employee.employeeId}</div>
            <div className="el-panel-hero-badges">
              <span className="el-panel-badge el-panel-badge-green">{employee.employmentTypeName}</span>
              {employee.designationName && (
                <span className="el-panel-badge">{employee.designationName}</span>
              )}
            </div>
          </div>
          <div className="el-panel-hero-actions">
            <button className="el-panel-hero-btn" onClick={onEdit} title="Edit employee">
              <Ico.Edit />
            </button>
            <button className="el-panel-hero-btn el-panel-hero-btn-del" onClick={onDelete} title="Delete employee">
              <Ico.Trash />
            </button>
          </div>
        </div>

        <div className="el-panel-content">
          {/* Contact */}
          <div className="el-panel-section">
            <div className="el-panel-section-title">Contact</div>
            <div className="el-panel-row"><Ico.Email size={14} /><span>{employee.email}</span></div>
            <div className="el-panel-row"><Ico.Phone /><span>{employee.phoneNumber}</span></div>
          </div>

          <div className="el-panel-divider" />

          {/* Organisation */}
          <div className="el-panel-section">
            <div className="el-panel-section-title">Organisation</div>
            {employee.departmentName && (
              <div className="el-panel-row"><Ico.Building /><span>{employee.departmentName}</span></div>
            )}
            <div className="el-panel-row"><Ico.Briefcase /><span>{employee.designationName}</span></div>
            <div className="el-panel-row">
              <Ico.Calendar size={13} />
              <span>Joined {employee.joiningDate}</span>
            </div>
          </div>

          {/* Leave policy */}
          {employee.leavePolicy && (
            <>
              <div className="el-panel-divider" />
              <div className="el-panel-section" style={{ paddingBottom: 24 }}>
                <div className="el-panel-section-title">
                  <Ico.Shield /> Leave Policy — {employee.leavePolicy.policyName}
                </div>
                {leaves.length > 0 ? (
                  <div className="el-leave-grid">
                    {leaves.map(c => (
                      <div key={c.id} className="el-leave-card">
                        <div className="el-leave-days">{c.allocatedDays}</div>
                        {c.leaveCode && <div className="el-leave-code">{c.leaveCode}</div>}
                        <div className="el-leave-name">{c.leaveTypeName}</div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <span className="el-no-leaves">No leave configurations set</span>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

// ── Stats strip ────────────────────────────────────────────────────────────
function StatsStrip({ employees }) {
  const total     = employees.length;
  const typeMap   = {};
  employees.forEach(e => {
    const key = e.employmentTypeName || "Unknown";
    typeMap[key] = (typeMap[key] || 0) + 1;
  });
  const topType = Object.entries(typeMap).sort((a,b) => b[1]-a[1])[0];
  const depts   = new Set(employees.map(e => e.departmentName).filter(Boolean)).size;

  return (
    <div className="el-stats">
      <div className="el-stat-card">
        <div className="el-stat-label">Total Employees</div>
        <div className="el-stat-value">{total}</div>
        <div className="el-stat-sub">Across all departments</div>
      </div>
      <div className="el-stat-card">
        <div className="el-stat-label">Departments</div>
        <div className="el-stat-value">{depts}</div>
        <div className="el-stat-sub">Active units</div>
      </div>
      {topType && (
        <div className="el-stat-card">
          <div className="el-stat-label">Largest Group</div>
          <div className="el-stat-value">{topType[1]}</div>
          <div className="el-stat-sub">{topType[0]}</div>
        </div>
      )}
    </div>
  );
}

// ── Main component ─────────────────────────────────────────────────────────
export default function EmployeeList({ highlightId }) {
  const [employees, setEmployees]       = useState([]);
  const [loading, setLoading]           = useState(true);
  const [search, setSearch]             = useState("");
  const [selected, setSelected]         = useState(null);
  const [editTarget, setEditTarget]     = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [saving, setSaving]             = useState(false);
  const [deleting, setDeleting]         = useState(false);
  const [toasts, setToasts]             = useState([]);

  const addToast = useCallback((message, type = "success") => {
    const id = Date.now();
    setToasts(t => [...t, { id, message, type }]);
  }, []);

  const removeToast = useCallback(id => {
    setToasts(t => t.filter(x => x.id !== id));
  }, []);

  const loadEmployees = useCallback(() => {
    setLoading(true);
    fetchAllEmployees()
      .then(({ employees }) => setEmployees(employees))
      .catch(() => addToast("Failed to load employees.", "error"))
      .finally(() => setLoading(false));
  }, [addToast]);

  useEffect(() => { loadEmployees(); }, [loadEmployees]);

  useEffect(() => {
    if (highlightId && employees.length > 0) {
      const emp = employees.find(e => e.id === highlightId);
      if (emp) setSelected(emp);
    }
  }, [highlightId, employees]);

  // ── Save edit
  const handleSaveEdit = async (form, profilePicFile) => {
    setSaving(true);
    try {
      const updated = await updateEmployee(editTarget.id, form, profilePicFile);
      setEmployees(prev => prev.map(e => e.id === updated.id ? updated : e));
      setSelected(updated);
      setEditTarget(null);
      addToast("Employee updated successfully!");
    } catch (err) {
      const msg = err?.response?.data?.message || "Failed to update employee.";
      addToast(msg, "error");
    } finally {
      setSaving(false);
    }
  };

  // ── Confirm delete
  const handleConfirmDelete = async () => {
    setDeleting(true);
    try {
      await deleteEmployee(deleteTarget.id);
      setEmployees(prev => prev.filter(e => e.id !== deleteTarget.id));
      setDeleteTarget(null);
      setSelected(null);
      addToast("Employee removed from the system.");
    } catch (err) {
      const msg = err?.response?.data?.message || "Failed to delete employee.";
      addToast(msg, "error");
    } finally {
      setDeleting(false);
    }
  };

  const filtered = employees.filter(e =>
    [e.fullName, e.email, e.employeeId, e.departmentName, e.designationName]
      .join(" ").toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="el-main">

      {/* Toast notifications */}
      <div className="el-toast-wrap">
        {toasts.map(t => (
          <ToastItem key={t.id} message={t.message} type={t.type} onClose={() => removeToast(t.id)} />
        ))}
      </div>

      {/* Top bar */}
      <div className="el-topbar">
        <div>
          <h1 className="el-page-title">Employee List</h1>
          <p className="el-page-sub">
            <span className="el-count-pill">{employees.length}</span>
            employees onboarded
          </p>
        </div>
      </div>

      {/* Stats (hidden on mobile) */}
      {!loading && employees.length > 0 && <StatsStrip employees={employees} />}

      {/* Controls */}
      <div className="el-controls">
        <div className="el-search-wrap">
          <span className="el-search-icon"><Ico.Search /></span>
          <input
            className="el-search"
            placeholder="Search by name, email, department…"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
        <button className="el-filter-btn">
          <Ico.Filter /> Filter
        </button>
      </div>

      {/* Grid */}
      <div className="el-grid-wrap">
        {loading ? (
          <div className="el-grid">
            {[1,2,3,4,5,6].map(i => <SkeletonCard key={i} />)}
          </div>
        ) : filtered.length === 0 ? (
          <div className="el-empty">
            <div className="el-empty-icon"><Ico.Users /></div>
            <h3>{search ? "No results found" : "No employees yet"}</h3>
            <p>{search ? `Nothing matched "${search}" — try a different term.` : "Add your first employee to get started."}</p>
          </div>
        ) : (
          <div className="el-grid">
            {filtered.map(emp => (
              <div
                key={emp.id}
                className={`el-card${highlightId === emp.id ? " el-card-highlight" : ""}`}
                onClick={() => setSelected(emp)}
              >
                <div className="el-card-body">
                  <div className="el-card-top">
                    <Avatar name={emp.fullName} size={44} src={emp.profilePicture} />
                    <div className="el-card-info">
                      <div className="el-card-name">{emp.fullName}</div>
                      <div className="el-card-empid">{emp.employeeId}</div>
                    </div>
                    {/* Hover actions */}
                    <div className="el-card-actions" onClick={e => e.stopPropagation()}>
                      <button
                        className="el-card-action"
                        title="Edit"
                        onClick={e => { e.stopPropagation(); setEditTarget(emp); }}
                      >
                        <Ico.Edit />
                      </button>
                      <button
                        className="el-card-action el-card-action-del"
                        title="Delete"
                        onClick={e => { e.stopPropagation(); setDeleteTarget(emp); }}
                      >
                        <Ico.Trash />
                      </button>
                    </div>
                  </div>

                  <div className="el-card-meta">
                    {emp.departmentName && (
                      <span className="el-card-meta-item"><Ico.Building /><span>{emp.departmentName}</span></span>
                    )}
                    <span className="el-card-meta-item"><Ico.Briefcase /><span>{emp.designationName}</span></span>
                    <span className="el-card-meta-item"><Ico.Email size={13} /> <span>{emp.email}</span></span>
                  </div>
                </div>

                <div className="el-card-footer">
                  <TypeBadge label={emp.employmentTypeName} />
                  <span className="el-card-date">
                    <Ico.Calendar size={11} /> {emp.joiningDate}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Detail panel */}
      <EmployeeDetailPanel
        employee={selected}
        onClose={() => setSelected(null)}
        onEdit={() => { setEditTarget(selected); }}
        onDelete={() => { setDeleteTarget(selected); }}
      />

      {/* Edit modal */}
      {editTarget && (
        <EditModal
          employee={editTarget}
          onSave={handleSaveEdit}
          onCancel={() => setEditTarget(null)}
          saving={saving}
        />
      )}

      {/* Delete modal */}
      {deleteTarget && (
        <DeleteModal
          employee={deleteTarget}
          onConfirm={handleConfirmDelete}
          onCancel={() => setDeleteTarget(null)}
          loading={deleting}
        />
      )}
    </div>
  );
}