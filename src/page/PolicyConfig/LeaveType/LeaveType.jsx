import { useState, useCallback, useEffect } from "react";
import "./LeaveType.css";
import {
  fetchAllLeaveTypes,
  createLeaveType,
  updateLeaveType,
  deleteLeaveType,
} from "../../../api/leaveTypes";

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

const DEFAULT_FORM = { name: "", code: "", status: "" };

function ToastStack({ toasts }) {
  return (
    <div className="lt-toast-stack">
      {toasts.map(t => (
        <div key={t.id} className={`lt-toast ${t.type}`}>{t.msg}</div>
      ))}
    </div>
  );
}

function SkeletonRows() {
  return Array.from({ length: 5 }).map((_, i) => (
    <tr key={i} className="lt-skeleton-row">
      <td><div className="lt-skel lt-skel-name" /></td>
      <td><div className="lt-skel lt-skel-code" /></td>
      <td><div className="lt-skel lt-skel-badge" /></td>
      <td></td>
    </tr>
  ));
}

export default function LeaveTypes() {
  const [leaveTypes,   setLeaveTypes]   = useState([]);
  const [loading,      setLoading]      = useState(true);
  const [error,        setError]        = useState(null);
  const [modal,        setModal]        = useState(false);
  const [editing,      setEditing]      = useState(null);
  const [form,         setForm]         = useState(DEFAULT_FORM);
  const [errors,       setErrors]       = useState({});
  const [saving,       setSaving]       = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting,     setDeleting]     = useState(false);
  const [search,       setSearch]       = useState("");
  const [toasts,       setToasts]       = useState([]);

  /* ── Toast helper ── */
  const toast = useCallback((msg, type = "success") => {
    const id = Date.now();
    setToasts(t => [...t, { id, msg, type }]);
    setTimeout(() => setToasts(t => t.filter(x => x.id !== id)), 3500);
  }, []);

  /* ── Load ── */
  const loadLeaveTypes = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const { leaveTypes: data } = await fetchAllLeaveTypes();
      setLeaveTypes(data || []);
    } catch (err) {
      setError(err.response?.data?.message ?? err.message ?? "Failed to load leave types");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadLeaveTypes(); }, [loadLeaveTypes]);

  /* ── Open modals ── */
  const openAdd = () => {
    setEditing(null);
    setForm(DEFAULT_FORM);
    setErrors({});
    setModal(true);
  };

  const openEdit = (lt) => {
    setEditing(lt);
    setForm({ name: lt.name || "", code: lt.code || "", status: lt.status || "" });
    setErrors({});
    setModal(true);
  };

  /* ── Validate ── */
  const validate = () => {
    const e = {};
    if (!form.name?.trim()) e.name   = "Leave Type Name is required";
    if (!form.code?.trim()) e.code   = "Leave Code is required";
    if (!form.status)       e.status = "Status is required";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  /* ── Save ── */
  const save = async () => {
    if (!validate()) return;
    setSaving(true);
    try {
      if (editing) {
        const updated = await updateLeaveType(editing.id, form);
        setLeaveTypes(ls => ls.map(l => l.id === updated.id ? updated : l));
        toast("Leave type updated");
      } else {
        const created = await createLeaveType(form);
        setLeaveTypes(ls => [...ls, created]);
        toast("Leave type created");
      }
      setModal(false);
    } catch (err) {
      toast(err.response?.data?.message ?? err.message ?? "Save failed", "error");
    } finally {
      setSaving(false);
    }
  };

  /* ── Delete ── */
  const confirmDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await deleteLeaveType(deleteTarget.id);
      setLeaveTypes(ls => ls.filter(l => l.id !== deleteTarget.id));
      toast("Leave type deleted");
      setDeleteTarget(null);
    } catch (err) {
      toast(err.response?.data?.message ?? err.message ?? "Delete failed", "error");
    } finally {
      setDeleting(false);
    }
  };

  /* ── Filtered list ── */
  const filtered = leaveTypes.filter(lt =>
    lt.name?.toLowerCase().includes(search.toLowerCase()) ||
    lt.code?.toLowerCase().includes(search.toLowerCase())
  );

  /* ════════════════════════════════════════
     RENDER
  ════════════════════════════════════════ */
  return (
    <>
      <ToastStack toasts={toasts} />

      <div className="lt-section fade-up">
        {/* Header */}
        <div className="lt-sec-head">
          <div>
            <div className="lt-sec-title">Leave Types</div>
            <div className="lt-sec-sub">Define reusable leave categories for your organisation</div>
          </div>
          <button className="lt-add-btn" onClick={openAdd} disabled={loading}>
            <PlusIcon /> New Leave Type
          </button>
        </div>

        {/* Search bar */}
        <div className="lt-toolbar">
          <div className="lt-search-wrap">
            <svg className="lt-search-ico" width="15" height="15" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            <input
              className="lt-search"
              type="text"
              placeholder="Search leave types…"
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
            {search && (
              <button className="lt-search-clear" onClick={() => setSearch("")}>×</button>
            )}
          </div>
          <div className="lt-count">
            {!loading && (
              <span>{filtered.length} {filtered.length === 1 ? "type" : "types"}</span>
            )}
          </div>
        </div>

        {/* Error banner */}
        {error && (
          <div className="lt-error-banner">
            <span>⚠ {error}</span>
            <button className="lt-retry-btn" onClick={loadLeaveTypes}>Retry</button>
          </div>
        )}

        {/* Table */}
        <div className="lt-table-wrap">
          <table className="lt-table">
            <thead>
              <tr>
                <th>Leave Type</th>
                <th>Code</th>
                <th>Status</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {loading && <SkeletonRows />}

              {!loading && filtered.length === 0 && !error && (
                <tr>
                  <td colSpan="4" className="lt-empty-cell">
                    {search
                      ? `No results for "${search}"`
                      : "No leave types yet. Create your first one!"}
                  </td>
                </tr>
              )}

              {!loading && filtered.map(lt => (
                <tr key={lt.id}>
                  <td>
                    <div className="lt-type-cell">
                      <div className="lt-type-dot" style={{ background: lt.color || "#3b5bdb" }} />
                      <span className="lt-type-name">{lt.name}</span>
                    </div>
                  </td>
                  <td><span className="lt-code-badge">{lt.code}</span></td>
                  <td>
                    <span className={`lt-status-badge ${lt.status === "Active" ? "active" : "inactive"}`}>
                      {lt.status}
                    </span>
                  </td>
                  <td>
                    <div className="lt-row-actions">
                      <button className="lt-icon-btn" onClick={() => openEdit(lt)} title="Edit">
                        <EditIcon />
                      </button>
                      <button
                        className="lt-icon-btn danger"
                        onClick={() => setDeleteTarget({ id: lt.id, name: lt.name })}
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

      {/* ═══════════ MODAL: LEAVE TYPE ═══════════ */}
      {modal && (
        <div className="lt-overlay" onClick={() => !saving && setModal(false)}>
          <div className="lt-modal" onClick={e => e.stopPropagation()}>
            <div className="lt-modal-head">
              <span>{editing ? "Edit Leave Type" : "New Leave Type"}</span>
              <button className="lt-icon-btn" onClick={() => setModal(false)} disabled={saving}>
                <CloseIcon />
              </button>
            </div>

            <div className="lt-modal-body">
              {/* Leave Type Name */}
              <div>
                <label className="lt-label">
                  Leave Type Name <span className="lt-required">*</span>
                </label>
                <input
                  className={`lt-input${errors.name ? " error" : ""}`}
                  placeholder="e.g. Annual Leave"
                  value={form.name}
                  onChange={e => { setForm({ ...form, name: e.target.value }); setErrors(p => ({ ...p, name: "" })); }}
                />
                {errors.name && <div className="lt-field-error">{errors.name}</div>}
              </div>

              {/* Leave Code */}
              <div>
                <label className="lt-label">
                  Leave Code <span className="lt-required">*</span>
                </label>
                <input
                  className={`lt-input${errors.code ? " error" : ""}`}
                  placeholder="e.g. AL"
                  value={form.code}
                  maxLength={5}
                  onChange={e => { setForm({ ...form, code: e.target.value.toUpperCase() }); setErrors(p => ({ ...p, code: "" })); }}
                />
                <div className="lt-hint">Short uppercase code, max 5 characters</div>
                {errors.code && <div className="lt-field-error">{errors.code}</div>}
              </div>

              {/* Status */}
              <div>
                <label className="lt-label">
                  Status <span className="lt-required">*</span>
                </label>
                <select
                  className={`lt-input${errors.status ? " error" : ""}`}
                  value={form.status}
                  onChange={e => { setForm({ ...form, status: e.target.value }); setErrors(p => ({ ...p, status: "" })); }}
                >
                  <option value="">— Select Status —</option>
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </select>
                {errors.status && <div className="lt-field-error">{errors.status}</div>}
              </div>
            </div>

            <div className="lt-modal-foot">
              <button className="lt-cancel-btn" onClick={() => setModal(false)} disabled={saving}>
                Cancel
              </button>
              <button className="lt-save-btn" onClick={save} disabled={saving}>
                {saving ? <SpinIcon s={14} /> : <CheckIcon />}
                {saving ? "Saving…" : editing ? "Update Leave Type" : "Create Leave Type"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ═══════════ MODAL: DELETE CONFIRM ═══════════ */}
      {deleteTarget && (
        <div className="lt-overlay" onClick={() => !deleting && setDeleteTarget(null)}>
          <div className="lt-modal lt-modal-sm" onClick={e => e.stopPropagation()}>
            <span className="lt-del-icon">🗑</span>
            <div className="lt-del-title">Confirm Delete</div>
            <div className="lt-del-sub">
              Delete <span className="lt-del-name">"{deleteTarget.name}"</span>?<br />
              This will also remove it from all leave policies.
            </div>
            <div className="lt-modal-foot" style={{ justifyContent: "center" }}>
              <button className="lt-cancel-btn" onClick={() => setDeleteTarget(null)} disabled={deleting}>
                Cancel
              </button>
              <button className="lt-delete-btn" onClick={confirmDelete} disabled={deleting}>
                {deleting ? "Deleting…" : "Yes, Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}