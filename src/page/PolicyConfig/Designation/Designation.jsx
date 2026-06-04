import { useState, useCallback, useEffect } from "react";
import "./Designation.css";
import {
  fetchAllDesignations,
  createDesignation,
  updateDesignation,
  deleteDesignation,
} from "../../../api/Designation";
import { fetchAllDepartments } from "../../../api/Department";

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

/* ════════════════════════════════════════════
   CONSTANTS
════════════════════════════════════════════ */
const DEFAULT_FORM = { name: "", department: "", departmentId: null, status: "" };

/* ════════════════════════════════════════════
   TOAST COMPONENT
════════════════════════════════════════════ */
function ToastStack({ toasts }) {
  return (
    <div className="dg-toast-stack">
      {toasts.map(t => (
        <div key={t.id} className={`dg-toast ${t.type}`}>{t.msg}</div>
      ))}
    </div>
  );
}

/* ════════════════════════════════════════════
   MAIN COMPONENT
════════════════════════════════════════════ */
export default function Designation() {
  const [desigs,        setDesigs]        = useState([]);
  const [departments,   setDepartments]   = useState([]); // fetched internally
  const [loading,       setLoading]       = useState(true);
  const [deptsLoading,  setDeptsLoading]  = useState(true);
  const [saving,        setSaving]        = useState(false);
  const [desigModal,    setDesigModal]    = useState(false);
  const [editingDesig,  setEditingDesig]  = useState(null);
  const [dgForm,        setDgForm]        = useState(DEFAULT_FORM);
  const [errors,        setErrors]        = useState({});
  const [deleteTarget,  setDeleteTarget]  = useState(null);
  const [deleting,      setDeleting]      = useState(false);
  const [toasts,        setToasts]        = useState([]);

  /* ── Toast helper ── */
  const toast = useCallback((msg, type = "success") => {
    const id = Date.now();
    setToasts(t => [...t, { id, msg, type }]);
    setTimeout(() => setToasts(t => t.filter(x => x.id !== id)), 3500);
  }, []);

  /* ════════════════════════════════════════
     FETCH DESIGNATIONS
  ════════════════════════════════════════ */
  const loadDesignations = useCallback(async () => {
    setLoading(true);
    try {
      const data = await fetchAllDesignations();
      setDesigs(data);
    } catch (err) {
      toast("Failed to load designations", "error");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [toast]);

  /* ════════════════════════════════════════
     FETCH DEPARTMENTS (for dropdown)
  ════════════════════════════════════════ */
  const loadDepartments = useCallback(async () => {
    setDeptsLoading(true);
    try {
      const data = await fetchAllDepartments();
      setDepartments(data); // data is already mapped via deptApiToUi → { id, name, ... }
    } catch (err) {
      toast("Failed to load departments", "error");
      console.error(err);
    } finally {
      setDeptsLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    loadDesignations();
    loadDepartments();
  }, [loadDesignations, loadDepartments]);

  /* ════════════════════════════════════════
     OPEN MODALS
  ════════════════════════════════════════ */
  const openAddDesig = () => {
    setEditingDesig(null);
    setDgForm(DEFAULT_FORM);
    setErrors({});
    setDesigModal(true);
  };

  const openEditDesig = (d) => {
    setEditingDesig(d.id);
    setDgForm({
      name:         d.name,
      department:   d.department,
      departmentId: d.departmentId,
      status:       d.status,
    });
    setErrors({});
    setDesigModal(true);
  };

  /* ════════════════════════════════════════
     VALIDATE
  ════════════════════════════════════════ */
  const validate = () => {
    const newErrors = {};
    if (!dgForm.name?.trim())  newErrors.name       = "Designation Name is required";
    if (!dgForm.department)    newErrors.department = "Department is required";
    if (!dgForm.status)        newErrors.status     = "Status is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  /* ════════════════════════════════════════
     SAVE (CREATE / UPDATE)
  ════════════════════════════════════════ */
  const saveDesig = async () => {
    if (!validate()) return;
    setSaving(true);
    try {
      if (editingDesig !== null) {
        const updated = await updateDesignation(editingDesig, dgForm, departments);
        setDesigs(ds => ds.map(d => d.id === editingDesig ? updated : d));
        toast("Designation updated");
      } else {
        const created = await createDesignation(dgForm, departments);
        setDesigs(ds => [...ds, created]);
        toast("Designation created");
      }
      setDesigModal(false);
    } catch (err) {
      toast(err?.response?.data?.message || "Failed to save designation", "error");
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  /* ════════════════════════════════════════
     DELETE
  ════════════════════════════════════════ */
  const confirmDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await deleteDesignation(deleteTarget.id);
      setDesigs(ds => ds.filter(d => d.id !== deleteTarget.id));
      toast("Designation deleted");
      setDeleteTarget(null);
    } catch (err) {
      toast(err?.response?.data?.message || "Failed to delete designation", "error");
      console.error(err);
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

      <div className="dg-section fade-up">
        {/* Header */}
        <div className="dg-sec-head">
          <div>
            <div className="dg-sec-title">Designations</div>
            <div className="dg-sec-sub">Configure job titles and assignments</div>
          </div>
          <button className="dg-add-btn" onClick={openAddDesig}>
            <PlusIcon /> New Designation
          </button>
        </div>

        {/* Table */}
        <div className="dg-table-wrap">
          <table className="dg-table">
            <thead>
              <tr>
                <th>Designation</th>
                <th>Department</th>
                <th>Status</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {loading && (
                <tr>
                  <td colSpan="4" style={{ textAlign: "center", padding: "24px", color: "#9ca3af" }}>
                    Loading…
                  </td>
                </tr>
              )}

              {!loading && desigs.length === 0 && (
                <tr>
                  <td colSpan="4" style={{ textAlign: "center", padding: "24px", color: "#9ca3af" }}>
                    No designations yet. Create your first one!
                  </td>
                </tr>
              )}

              {!loading && desigs.map(d => (
                <tr key={d.id}>
                  <td><span className="dg-desig-name">{d.name}</span></td>
                  <td>
                    {d.department && d.department !== "—"
                      ? d.department
                      : <span style={{ color: "#9ca3af", fontStyle: "italic" }}>—</span>
                    }
                  </td>
                  <td>
                    <span className={`dg-status-badge ${d.status === "Active" ? "active" : "inactive"}`}>
                      {d.status}
                    </span>
                  </td>
                  <td>
                    <div className="dg-row-actions">
                      <button className="dg-icon-btn" onClick={() => openEditDesig(d)} title="Edit">
                        <EditIcon />
                      </button>
                      <button
                        className="dg-icon-btn danger"
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
      </div>

      {/* ═══════════ MODAL: DESIGNATION ═══════════ */}
      {desigModal && (
        <div className="dg-overlay" onClick={() => setDesigModal(false)}>
          <div className="dg-modal" onClick={e => e.stopPropagation()}>
            <div className="dg-modal-head">
              <span>{editingDesig !== null ? "Edit Designation" : "New Designation"}</span>
              <button className="dg-icon-btn" onClick={() => setDesigModal(false)}>
                <CloseIcon />
              </button>
            </div>

            <div className="dg-modal-body">
              {/* Designation Name */}
              <div>
                <label className="dg-label">Designation Name <span className="dg-required">*</span></label>
                <input
                  className={`dg-input${errors.name ? " error" : ""}`}
                  placeholder="e.g. Senior Software Engineer"
                  value={dgForm.name}
                  onChange={e => {
                    setDgForm({ ...dgForm, name: e.target.value });
                    setErrors(p => ({ ...p, name: "" }));
                  }}
                />
                {errors.name && <div className="dg-field-error">{errors.name}</div>}
              </div>

              {/* Department */}
              <div>
                <label className="dg-label">Department <span className="dg-required">*</span></label>
                <select
                  className={`dg-input${errors.department ? " error" : ""}`}
                  value={dgForm.department}
                  disabled={deptsLoading}
                  onChange={e => {
                    const selectedName = e.target.value;
                    const matched = departments.find(d => d.name === selectedName);
                    setDgForm({
                      ...dgForm,
                      department:   selectedName,
                      departmentId: matched ? matched.id : null,
                    });
                    setErrors(p => ({ ...p, department: "" }));
                  }}
                >
                  <option value="">
                    {deptsLoading ? "Loading departments…" : "— Select Department —"}
                  </option>
                  {departments.map(d => (
                    <option key={d.id} value={d.name}>{d.name}</option>
                  ))}
                </select>
                {errors.department && <div className="dg-field-error">{errors.department}</div>}
              </div>

              {/* Status */}
              <div>
                <label className="dg-label">Status <span className="dg-required">*</span></label>
                <select
                  className={`dg-input${errors.status ? " error" : ""}`}
                  value={dgForm.status}
                  onChange={e => {
                    setDgForm({ ...dgForm, status: e.target.value });
                    setErrors(p => ({ ...p, status: "" }));
                  }}
                >
                  <option value="">— Select Status —</option>
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </select>
                {errors.status && <div className="dg-field-error">{errors.status}</div>}
              </div>
            </div>

            <div className="dg-modal-foot">
              <button className="dg-cancel-btn" onClick={() => setDesigModal(false)} disabled={saving}>
                Cancel
              </button>
              <button className="dg-save-btn" onClick={saveDesig} disabled={saving}>
                <CheckIcon />
                {saving
                  ? (editingDesig !== null ? "Updating…" : "Creating…")
                  : (editingDesig !== null ? "Update Designation" : "Create Designation")
                }
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ═══════════ MODAL: DELETE CONFIRM ═══════════ */}
      {deleteTarget && (
        <div className="dg-overlay" onClick={() => !deleting && setDeleteTarget(null)}>
          <div className="dg-modal dg-modal-sm" onClick={e => e.stopPropagation()}>
            <span className="dg-del-icon">🗑</span>
            <div className="dg-del-title">Confirm Delete</div>
            <div className="dg-del-sub">
              Delete <span className="dg-del-name">"{deleteTarget.name}"</span>?<br />
              This action cannot be undone.
            </div>
            <div className="dg-modal-foot" style={{ justifyContent: "center" }}>
              <button className="dg-cancel-btn" onClick={() => setDeleteTarget(null)} disabled={deleting}>
                Cancel
              </button>
              <button className="dg-delete-btn" onClick={confirmDelete} disabled={deleting}>
                {deleting ? "Deleting…" : "Yes, Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}