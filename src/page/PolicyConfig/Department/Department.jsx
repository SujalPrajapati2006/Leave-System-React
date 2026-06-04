import { useState, useEffect, useCallback } from "react";
import "./Department.css";
import {
  fetchAllDepartments,
  createDepartment,
  updateDepartment,
  deleteDepartment,
} from "../../../api/Department";
import { fetchAllPolicies } from "../../../api/leavePolicy";

/* ════════════════════════════════════════════
   ICON HELPERS
════════════════════════════════════════════ */
const Ico = ({ d, size = 16, color = "currentColor", fill = "none" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={fill}
    stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    {Array.isArray(d) ? d.map((p, i) => <path key={i} d={p} />) : <path d={d} />}
  </svg>
);

const PlusIcon  = ({ s = 15 }) => <Ico size={s} d={["M12 5v14", "M5 12h14"]} />;
const EditIcon  = ({ s = 14 }) => <Ico size={s} d={["M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7","M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"]} />;
const TrashIcon = ({ s = 14 }) => <Ico size={s} d={["M3 6h18","M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6","M8 6V4a2 2 0 012-2h4a2 2 0 012 2v2"]} />;
const CloseIcon = ({ s = 16 }) => <Ico size={s} d={["M18 6L6 18","M6 6l12 12"]} />;
const CheckIcon = ({ s = 14 }) => <Ico size={s} d="M20 6L9 17l-5-5" />;

const SpinIcon = ({ s = 14 }) => (
  <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
    <circle cx="12" cy="12" r="10" strokeOpacity="0.2" />
    <path d="M12 2a10 10 0 0110 10" strokeLinecap="round">
      <animateTransform attributeName="transform" type="rotate"
        from="0 12 12" to="360 12 12" dur="0.75s" repeatCount="indefinite" />
    </path>
  </svg>
);

/* ════════════════════════════════════════════
   CONSTANTS
════════════════════════════════════════════ */
const DEFAULT_DEPT = { name: "", code: "", leavePolicy: "", status: "" };

/* ════════════════════════════════════════════
   TOAST COMPONENT
════════════════════════════════════════════ */
function ToastStack({ toasts }) {
  return (
    <div className="dep-toast-stack">
      {toasts.map(t => (
        <div key={t.id} className={`dep-toast ${t.type}`}>{t.msg}</div>
      ))}
    </div>
  );
}

/* ════════════════════════════════════════════
   MAIN COMPONENT
════════════════════════════════════════════ */
export default function Department() {
  const [depts,       setDepts]       = useState([]);
  const [deptLoading, setDeptLoading] = useState(false);
  const [deptError,   setDeptError]   = useState(null);
  const [deptModal,   setDeptModal]   = useState(false);
  const [editingDept, setEditingDept] = useState(null);
  const [dForm,       setDForm]       = useState(DEFAULT_DEPT);
  const [dSaving,     setDSaving]     = useState(false);
  const [policies,    setPolicies]    = useState([]);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting,    setDeleting]    = useState(false);
  const [errors,      setErrors]      = useState({});
  const [toasts,      setToasts]      = useState([]);

  const toast = useCallback((msg, type = "success") => {
    const id = Date.now();
    setToasts(t => [...t, { id, msg, type }]);
    setTimeout(() => setToasts(t => t.filter(x => x.id !== id)), 3500);
  }, []);

  /* ── Load ── */
  const loadDepartments = useCallback(async () => {
    setDeptLoading(true);
    setDeptError(null);
    try {
      const data = await fetchAllDepartments();
      setDepts(data || []);
    } catch (err) {
      const msg = err.response?.data?.message ?? err.message ?? "Failed to load departments";
      setDeptError(msg);
    } finally {
      setDeptLoading(false);
    }
  }, []);

  const loadPolicies = useCallback(async () => {
    try {
      const { policies: loaded } = await fetchAllPolicies();
      setPolicies((loaded || []).filter(p => p.status === "Active"));
    } catch {
      /* silent — policies are used for dropdown only */
    }
  }, []);

  useEffect(() => {
    loadDepartments();
    loadPolicies();
  }, [loadDepartments, loadPolicies]);

  /* ── Open modals ── */
  const openAddDept = () => {
    setEditingDept(null);
    setDForm(DEFAULT_DEPT);
    setErrors({});
    setDeptModal(true);
  };

  const openEditDept = (d) => {
    setEditingDept(d);
    setDForm({
      name:        d.name || "",
      code:        d.code || "",
      leavePolicy: d.leavePolicy || "",
      status:      d.status || "",
    });
    setErrors({});
    setDeptModal(true);
  };

  /* ── Validate ── */
  const validateDeptForm = () => {
    const newErrors = {};
    if (!dForm.name?.trim())        newErrors.name        = "Department Name is required";
    if (!dForm.code?.trim())        newErrors.code        = "Department Code is required";
    if (!dForm.leavePolicy)         newErrors.leavePolicy = "Leave Policy selection is required";
    if (!dForm.status)              newErrors.status      = "Status selection is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  /* ── Save ── */
  const saveDept = async () => {
    if (!validateDeptForm()) return;
    setDSaving(true);
    try {
      if (editingDept && editingDept.id) {
        const updated = await updateDepartment(editingDept.id, dForm, policies);
        setDepts(ds => ds.map(d => d.id === updated.id ? updated : d));
        toast("Department updated successfully");
      } else {
        const created = await createDepartment(dForm, policies);
        setDepts(ds => [...ds, created]);
        toast("Department created successfully");
      }
      setDeptModal(false);
    } catch (err) {
      toast(err.response?.data?.message ?? err.message ?? "Failed to save department", "error");
    } finally {
      setDSaving(false);
    }
  };

  /* ── Delete ── */
  const confirmDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await deleteDepartment(deleteTarget.id);
      setDepts(ds => ds.filter(d => d.id !== deleteTarget.id));
      toast("Department deleted");
      setDeleteTarget(null);
    } catch (err) {
      toast(err.response?.data?.message ?? err.message ?? "Delete failed", "error");
    } finally {
      setDeleting(false);
    }
  };

  /* ════════════════════════════════════════
     RENDER
  ════════════════════════════════════════ */
  return (
    <>
      <ToastStack toasts={toasts} />

      <div className="dep-section fade-up">
        {/* Header */}
        <div className="dep-sec-head">
          <div>
            <div className="dep-sec-title">Departments</div>
            <div className="dep-sec-sub">Manage organisational departments and cost centres</div>
          </div>
          <button className="dep-add-btn" onClick={openAddDept} disabled={deptLoading}>
            <PlusIcon /> New Department
          </button>
        </div>

        {/* Error banner */}
        {deptError && (
          <div className="dep-error-banner">
            <span>⚠ {deptError}</span>
            <button className="dep-retry-btn" onClick={loadDepartments}>Retry</button>
          </div>
        )}

        {/* Loading / Table */}
        {deptLoading ? (
          <div className="dep-loading"><SpinIcon s={20} /> Loading departments…</div>
        ) : (
          <div className="dep-table-wrap">
            <table className="dep-table">
              <thead>
                <tr>
                  <th>Department</th>
                  <th>Code</th>
                  <th>Leave Policy</th>
                  <th>Status</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {depts.length === 0 && !deptError && (
                  <tr>
                    <td colSpan="5" style={{ textAlign: "center", padding: "24px", color: "#9ca3af" }}>
                      No departments found. Add a department to get started!
                    </td>
                  </tr>
                )}
                {depts.map(d => (
                  <tr key={d.id}>
                    <td><span className="dep-dept-name">{d.name}</span></td>
                    <td><span className="dep-code-badge">{d.code}</span></td>
                    <td>{d.leavePolicy || "—"}</td>
                    <td>
                      <span className={`dep-status-badge ${d.status === "Active" ? "active" : "inactive"}`}>
                        {d.status}
                      </span>
                    </td>
                    <td>
                      <div className="dep-row-actions">
                        <button className="dep-icon-btn" onClick={() => openEditDept(d)} title="Edit">
                          <EditIcon />
                        </button>
                        <button
                          className="dep-icon-btn danger"
                          onClick={() => setDeleteTarget({ id: d.id, name: d.name })}
                          title="Delete"
                        >
                          <TrashIcon />
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

      {/* ═══════════ MODAL: DEPARTMENT ═══════════ */}
      {deptModal && (
        <div className="dep-overlay" onClick={() => !dSaving && setDeptModal(false)}>
          <div className="dep-modal" onClick={e => e.stopPropagation()}>
            <div className="dep-modal-head">
              <span>{editingDept ? "Edit Department" : "New Department"}</span>
              <button className="dep-icon-btn" onClick={() => setDeptModal(false)} disabled={dSaving}>
                <CloseIcon />
              </button>
            </div>

            <div className="dep-modal-body">
              {/* Department Name */}
              <div>
                <label className="dep-label">Department Name <span className="dep-required">*</span></label>
                <input
                  className={`dep-input${errors.name ? " error" : ""}`}
                  placeholder="e.g. Engineering"
                  value={dForm.name}
                  onChange={e => { setDForm({ ...dForm, name: e.target.value }); setErrors(p => ({ ...p, name: "" })); }}
                />
                {errors.name && <div className="dep-field-error">{errors.name}</div>}
              </div>

              {/* Department Code */}
              <div>
                <label className="dep-label">Department Code <span className="dep-required">*</span></label>
                <input
                  className={`dep-input${errors.code ? " error" : ""}`}
                  placeholder="e.g. ENG"
                  value={dForm.code}
                  onChange={e => { setDForm({ ...dForm, code: e.target.value.toUpperCase() }); setErrors(p => ({ ...p, code: "" })); }}
                />
                {errors.code && <div className="dep-field-error">{errors.code}</div>}
              </div>

              {/* Leave Policy */}
              <div>
                <label className="dep-label">Leave Policy <span className="dep-required">*</span></label>
                <select
                  className={`dep-input${errors.leavePolicy ? " error" : ""}`}
                  value={dForm.leavePolicy}
                  onChange={e => { setDForm({ ...dForm, leavePolicy: e.target.value }); setErrors(p => ({ ...p, leavePolicy: "" })); }}
                >
                  <option value="">— Select Leave Policy —</option>
                  {policies.map(p => (
                    <option key={p.id} value={p.name}>{p.name}</option>
                  ))}
                </select>
                {errors.leavePolicy && <div className="dep-field-error">{errors.leavePolicy}</div>}
              </div>

              {/* Status */}
              <div>
                <label className="dep-label">Status <span className="dep-required">*</span></label>
                <select
                  className={`dep-input${errors.status ? " error" : ""}`}
                  value={dForm.status}
                  onChange={e => { setDForm({ ...dForm, status: e.target.value }); setErrors(p => ({ ...p, status: "" })); }}
                >
                  <option value="">— Select Status —</option>
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </select>
                {errors.status && <div className="dep-field-error">{errors.status}</div>}
              </div>
            </div>

            <div className="dep-modal-foot">
              <button className="dep-cancel-btn" onClick={() => setDeptModal(false)} disabled={dSaving}>Cancel</button>
              <button className="dep-save-btn" onClick={saveDept} disabled={dSaving}>
                {dSaving ? <SpinIcon s={14} /> : <CheckIcon />}
                {dSaving ? "Saving…" : editingDept ? "Update Department" : "Create Department"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ═══════════ MODAL: DELETE CONFIRM ═══════════ */}
      {deleteTarget && (
        <div className="dep-overlay" onClick={() => !deleting && setDeleteTarget(null)}>
          <div className="dep-modal dep-modal-sm" onClick={e => e.stopPropagation()}>
            <span className="dep-del-icon">🗑</span>
            <div className="dep-del-title">Confirm Delete</div>
            <div className="dep-del-sub">
              Delete <span className="dep-del-name">"{deleteTarget.name}"</span>?<br />
              This action cannot be undone.
            </div>
            <div className="dep-modal-foot" style={{ justifyContent: "center" }}>
              <button className="dep-cancel-btn" onClick={() => setDeleteTarget(null)} disabled={deleting}>Cancel</button>
              <button className="dep-delete-btn" onClick={confirmDelete} disabled={deleting}>
                {deleting ? "Deleting…" : "Yes, Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}