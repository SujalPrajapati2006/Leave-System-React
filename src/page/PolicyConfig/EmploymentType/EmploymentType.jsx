import { useState, useEffect, useCallback } from "react";
import "./EmploymentType.css";
import {
  fetchAllEmploymentTypes,
  createEmploymentType,
  updateEmploymentType,
  deleteEmploymentType,
} from "../../../api/EmploymentType";

/* ─── Tiny SVG helper ─── */
const Ico = ({ d, size = 16, stroke = "currentColor", fill = "none" }) => (
  <svg
    width={size} height={size}
    viewBox="0 0 24 24"
    fill={fill}
    stroke={stroke}
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    {Array.isArray(d)
      ? d.map((p, i) => <path key={i} d={p} />)
      : <path d={d} />}
  </svg>
);

/* ─── Icon set ─── */
const IconEdit      = () => <Ico size={15} d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" />;
const IconTrash     = () => <Ico size={15} d={["M3 6h18","M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2"]} />;
const IconPlus      = () => <Ico size={15} d={["M12 5v14","M5 12h14"]} />;
const IconCheck     = () => <Ico size={14} d="M20 6L9 17l-5-5" />;
const IconX         = () => <Ico size={14} d={["M18 6L6 18","M6 6l12 12"]} />;
const IconBriefcase = () => <Ico size={18} d={["M20 7H4a2 2 0 00-2 2v10a2 2 0 002 2h16a2 2 0 002-2V9a2 2 0 00-2-2z","M16 7V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v2"]} />;
const IconLoader    = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83">
      <animateTransform attributeName="transform" type="rotate" from="0 12 12" to="360 12 12" dur="1s" repeatCount="indefinite"/>
    </path>
  </svg>
);

/* ══════════════════════════════════════════════
   ModalForm
══════════════════════════════════════════════ */
function ModalForm({ title, form, setForm, errors, setErrors, onSave, onCancel, saveBtnLabel, saving }) {
  return (
    <div className="et-overlay" onClick={(e) => e.target === e.currentTarget && !saving && onCancel()}>
      <div className="et-modal" role="dialog" aria-modal="true" aria-labelledby="et-modal-title">
        <div className="et-modal-header">
          <h2 id="et-modal-title" className="et-modal-title">{title}</h2>
          <button className="et-modal-close" onClick={onCancel} aria-label="Close" disabled={saving}><IconX /></button>
        </div>

        <div className="et-modal-body">
          {/* Employment Type Name */}
          <div className={`et-field${errors.name ? " et-field-err" : ""}`}>
            <label className="et-label" htmlFor="et-name">
              Employment Type Name <span className="et-req">*</span>
            </label>
            <input
              id="et-name"
              className="et-input"
              type="text"
              placeholder="e.g. Permanent"
              value={form.name}
              onChange={e => {
                setForm(f => ({ ...f, name: e.target.value }));
                if (errors.name) setErrors(v => ({ ...v, name: "" }));
              }}
              autoFocus
              disabled={saving}
            />
            {errors.name && <span className="et-err-msg">{errors.name}</span>}
          </div>

          {/* Status */}
          <div className={`et-field${errors.status ? " et-field-err" : ""}`}>
            <label className="et-label" htmlFor="et-status">
              Status <span className="et-req">*</span>
            </label>
            <div className="et-select-wrap">
              <select
                id="et-status"
                className="et-select"
                value={form.status}
                onChange={e => {
                  setForm(f => ({ ...f, status: e.target.value }));
                  if (errors.status) setErrors(v => ({ ...v, status: "" }));
                }}
                disabled={saving}
              >
                <option value="">— Select Status —</option>
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>
              <span className="et-select-arrow">▾</span>
            </div>
            {errors.status && <span className="et-err-msg">{errors.status}</span>}
          </div>
        </div>

        <div className="et-modal-footer">
          <button className="et-btn et-btn-cancel" onClick={onCancel} disabled={saving}>Cancel</button>
          <button className="et-btn et-btn-primary" onClick={onSave} disabled={saving}>
            {saving ? <><IconLoader /> Saving…</> : <><IconCheck /> {saveBtnLabel}</>}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════
   DeleteModal
══════════════════════════════════════════════ */
function DeleteModal({ name, onConfirm, onCancel, deleting }) {
  return (
    <div className="et-overlay" onClick={(e) => e.target === e.currentTarget && !deleting && onCancel()}>
      <div className="et-modal et-modal-sm" role="alertdialog" aria-modal="true">
        <div className="et-modal-header">
          <h2 className="et-modal-title">Delete Employment Type</h2>
          <button className="et-modal-close" onClick={onCancel} disabled={deleting}><IconX /></button>
        </div>
        <div className="et-modal-body">
          <p className="et-del-msg">
            Are you sure you want to delete <strong>"{name}"</strong>?
            This action cannot be undone.
          </p>
        </div>
        <div className="et-modal-footer">
          <button className="et-btn et-btn-cancel" onClick={onCancel} disabled={deleting}>Cancel</button>
          <button className="et-btn et-btn-danger" onClick={onConfirm} disabled={deleting}>
            {deleting ? <><IconLoader /> Deleting…</> : <><IconTrash /> Delete</>}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════
   Main component
══════════════════════════════════════════════ */
export default function EmploymentType() {
  const [rows,       setRows]       = useState([]);
  const [loading,    setLoading]    = useState(true);
  const [apiError,   setApiError]   = useState(null);

  const [modal,      setModal]      = useState(false);
  const [editTarget, setEditTarget] = useState(null);
  const [delTarget,  setDelTarget]  = useState(null);

  const [form,       setForm]       = useState({ name: "", status: "" });
  const [errors,     setErrors]     = useState({});
  const [saving,     setSaving]     = useState(false);
  const [deleting,   setDeleting]   = useState(false);

  const [toast,      setToast]      = useState(null);

  /* ── load data ── */
  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      setApiError(null);
      const { employmentTypes } = await fetchAllEmploymentTypes();
      setRows(employmentTypes);
    } catch (err) {
      setApiError(err?.response?.data?.message || err.message || "Failed to load employment types.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadData(); }, [loadData]);

  /* ── toast helper ── */
  const flash = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3500);
  };

  /* ── open CREATE modal ── */
  const openCreate = () => {
    setForm({ name: "", status: "" });
    setErrors({});
    setModal(true);
  };

  /* ── open EDIT modal ── */
  const openEdit = (row) => {
    setForm({ name: row.name, status: row.status });
    setErrors({});
    setEditTarget(row);
  };

  /* ── validation ── */
  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name   = "Employment type name is required";
    if (!form.status)      e.status = "Status is required";
    return e;
  };

  /* ── create submit ── */
  const handleCreate = async () => {
    const e = validate();
    if (Object.keys(e).length) { setErrors(e); return; }
    try {
      setSaving(true);
      const created = await createEmploymentType(form);
      setRows(prev => [...prev, created]);
      setModal(false);
      flash(`"${created.name}" created successfully.`);
    } catch (err) {
      flash(err?.response?.data?.message || "Failed to create employment type.", "error");
    } finally {
      setSaving(false);
    }
  };

  /* ── edit submit ── */
  const handleEditSave = async () => {
    const e = validate();
    if (Object.keys(e).length) { setErrors(e); return; }
    try {
      setSaving(true);
      const updated = await updateEmploymentType(editTarget.id, form);
      setRows(prev => prev.map(r => r.id === editTarget.id ? updated : r));
      setEditTarget(null);
      flash(`"${updated.name}" updated successfully.`);
    } catch (err) {
      flash(err?.response?.data?.message || "Failed to update employment type.", "error");
    } finally {
      setSaving(false);
    }
  };

  /* ── delete confirm ── */
  const handleDelete = async () => {
    const name = rows.find(r => r.id === delTarget)?.name;
    try {
      setDeleting(true);
      await deleteEmploymentType(delTarget);
      setRows(prev => prev.filter(r => r.id !== delTarget));
      setDelTarget(null);
      flash(`"${name}" deleted.`, "error");
    } catch (err) {
      flash(err?.response?.data?.message || "Failed to delete employment type.", "error");
    } finally {
      setDeleting(false);
    }
  };

  const closeAll = () => {
    if (saving) return;
    setModal(false);
    setEditTarget(null);
    setDelTarget(null);
    setErrors({});
  };

  /* ══════════════ RENDER ══════════════ */
  return (
    <div className="et-root">

      {/* ── Toast ── */}
      {toast && (
        <div className={`et-toast et-toast-${toast.type}`}>
          {toast.type === "success" ? <IconCheck /> : <IconX />}
          <span>{toast.msg}</span>
        </div>
      )}

      {/* ── Modals ── */}
      {modal && (
        <ModalForm
          title="New Employment Type"
          form={form}
          setForm={setForm}
          errors={errors}
          setErrors={setErrors}
          onSave={handleCreate}
          onCancel={closeAll}
          saveBtnLabel="Create Employment Type"
          saving={saving}
        />
      )}

      {editTarget && (
        <ModalForm
          title="Edit Employment Type"
          form={form}
          setForm={setForm}
          errors={errors}
          setErrors={setErrors}
          onSave={handleEditSave}
          onCancel={closeAll}
          saveBtnLabel="Save Changes"
          saving={saving}
        />
      )}

      {delTarget && (
        <DeleteModal
          name={rows.find(r => r.id === delTarget)?.name}
          onConfirm={handleDelete}
          onCancel={() => !deleting && setDelTarget(null)}
          deleting={deleting}
        />
      )}

      {/* ── Page header ── */}
      <div className="et-header">
        <div className="et-header-left">
          <div className="et-header-icon"><IconBriefcase /></div>
          <div>
            <h1 className="et-title">Employment Types</h1>
            <p className="et-subtitle">Configure employment categories and their statuses</p>
          </div>
        </div>
        <button className="et-btn et-btn-primary et-new-btn" onClick={openCreate}>
          <IconPlus /> New Employment Type
        </button>
      </div>

      {/* ── Table card ── */}
      <div className="et-card">

        {/* Loading state */}
        {loading && (
          <div className="et-loading">
            <IconLoader />
            <span>Loading employment types…</span>
          </div>
        )}

        {/* API error state */}
        {!loading && apiError && (
          <div className="et-error-state">
            <p>{apiError}</p>
            <button className="et-btn et-btn-primary" onClick={loadData}>Retry</button>
          </div>
        )}

        {/* Empty state */}
        {!loading && !apiError && rows.length === 0 && (
          <div className="et-empty">
            <IconBriefcase />
            <p>No employment types found.</p>
            <button className="et-btn et-btn-primary" onClick={openCreate}>
              <IconPlus /> Add First Type
            </button>
          </div>
        )}

        {/* Table */}
        {!loading && !apiError && rows.length > 0 && (
          <table className="et-table">
            <thead>
              <tr>
                <th className="et-th">Employment Type</th>
                <th className="et-th">Status</th>
                <th className="et-th et-th-actions">Actions</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row, idx) => (
                <tr key={row.id} className="et-tr" style={{ animationDelay: `${idx * 40}ms` }}>
                  <td className="et-td et-td-name">
                    <div className="et-type-pill">
                      <span className="et-type-dot" />
                      {row.name}
                    </div>
                  </td>
                  <td className="et-td">
                    <span className={`et-badge et-badge-${row.status.toLowerCase()}`}>
                      {row.status}
                    </span>
                  </td>
                  <td className="et-td et-td-actions">
                    <button
                      className="et-action-btn et-action-edit"
                      onClick={() => openEdit(row)}
                      title="Edit"
                      aria-label={`Edit ${row.name}`}
                    >
                      <IconEdit />
                    </button>
                    <button
                      className="et-action-btn et-action-del"
                      onClick={() => setDelTarget(row.id)}
                      title="Delete"
                      aria-label={`Delete ${row.name}`}
                    >
                      <IconTrash />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}