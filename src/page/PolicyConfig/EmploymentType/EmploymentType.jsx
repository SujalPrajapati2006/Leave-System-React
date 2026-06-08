import { useState } from "react";
import "./EmploymentType.css";

/* ─── Seed data (replace with API call) ─── */
const SEED = [
  { id: 1, name: "Permanent",  status: "Active" },
  { id: 2, name: "Contract",   status: "Active" },
  { id: 3, name: "Intern",     status: "Active" },
  { id: 4, name: "Probation",  status: "Active" },
  { id: 5, name: "Consultant", status: "Inactive" },
];

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
const IconEdit   = () => <Ico size={15} d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" />;
const IconTrash  = () => <Ico size={15} d={["M3 6h18","M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2"]} />;
const IconPlus   = () => <Ico size={15} d={["M12 5v14","M5 12h14"]} />;
const IconCheck  = () => <Ico size={14} d="M20 6L9 17l-5-5" />;
const IconX      = () => <Ico size={14} d={["M18 6L6 18","M6 6l12 12"]} />;
const IconBriefcase = () => (
  <Ico size={18} d={["M20 7H4a2 2 0 00-2 2v10a2 2 0 002 2h16a2 2 0 002-2V9a2 2 0 00-2-2z","M16 7V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v2"]} />
);

let nextId = SEED.length + 1;

export default function EmploymentType() {
  const [rows,       setRows]       = useState(SEED);
  const [modal,      setModal]      = useState(false);   // create modal
  const [editTarget, setEditTarget] = useState(null);    // { id, name, status }
  const [delTarget,  setDelTarget]  = useState(null);    // id to confirm delete
  const [form,       setForm]       = useState({ name: "", status: "" });
  const [errors,     setErrors]     = useState({});
  const [toast,      setToast]      = useState(null);    // { msg, type }

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
    if (!form.name.trim())  e.name   = "Employment type name is required";
    if (!form.status)       e.status = "Status is required";
    return e;
  };

  /* ── create submit ── */
  const handleCreate = () => {
    const e = validate();
    if (Object.keys(e).length) { setErrors(e); return; }
    setRows(prev => [...prev, { id: nextId++, name: form.name.trim(), status: form.status }]);
    setModal(false);
    flash(`"${form.name.trim()}" created successfully.`);
  };

  /* ── edit submit ── */
  const handleEditSave = () => {
    const e = validate();
    if (Object.keys(e).length) { setErrors(e); return; }
    setRows(prev => prev.map(r =>
      r.id === editTarget.id ? { ...r, name: form.name.trim(), status: form.status } : r
    ));
    setEditTarget(null);
    flash(`"${form.name.trim()}" updated successfully.`);
  };

  /* ── delete confirm ── */
  const handleDelete = () => {
    const name = rows.find(r => r.id === delTarget)?.name;
    setRows(prev => prev.filter(r => r.id !== delTarget));
    setDelTarget(null);
    flash(`"${name}" deleted.`, "error");
  };

  const closeAll = () => {
    setModal(false);
    setEditTarget(null);
    setDelTarget(null);
    setErrors({});
  };

  /* ── reusable modal form ── */
  const ModalForm = ({ title, onSave, onCancel, saveBtnLabel = "Create Employment Type" }) => (
    <div className="et-overlay" onClick={(e) => e.target === e.currentTarget && onCancel()}>
      <div className="et-modal" role="dialog" aria-modal="true" aria-labelledby="et-modal-title">
        <div className="et-modal-header">
          <h2 id="et-modal-title" className="et-modal-title">{title}</h2>
          <button className="et-modal-close" onClick={onCancel} aria-label="Close"><IconX /></button>
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
          <button className="et-btn et-btn-cancel" onClick={onCancel}>Cancel</button>
          <button className="et-btn et-btn-primary" onClick={onSave}>
            <IconCheck /> {saveBtnLabel}
          </button>
        </div>
      </div>
    </div>
  );

  /* ── delete confirm modal ── */
  const DeleteModal = () => {
    const name = rows.find(r => r.id === delTarget)?.name;
    return (
      <div className="et-overlay" onClick={(e) => e.target === e.currentTarget && setDelTarget(null)}>
        <div className="et-modal et-modal-sm" role="alertdialog" aria-modal="true">
          <div className="et-modal-header">
            <h2 className="et-modal-title">Delete Employment Type</h2>
            <button className="et-modal-close" onClick={() => setDelTarget(null)} aria-label="Close"><IconX /></button>
          </div>
          <div className="et-modal-body">
            <p className="et-del-msg">
              Are you sure you want to delete <strong>"{name}"</strong>?
              This action cannot be undone.
            </p>
          </div>
          <div className="et-modal-footer">
            <button className="et-btn et-btn-cancel" onClick={() => setDelTarget(null)}>Cancel</button>
            <button className="et-btn et-btn-danger" onClick={handleDelete}>
              <IconTrash /> Delete
            </button>
          </div>
        </div>
      </div>
    );
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
          onSave={handleCreate}
          onCancel={closeAll}
          saveBtnLabel="Create Employment Type"
        />
      )}

      {editTarget && (
        <ModalForm
          title="Edit Employment Type"
          onSave={handleEditSave}
          onCancel={closeAll}
          saveBtnLabel="Save Changes"
        />
      )}

      {delTarget && <DeleteModal />}

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
        {rows.length === 0 ? (
          <div className="et-empty">
            <IconBriefcase />
            <p>No employment types found.</p>
            <button className="et-btn et-btn-primary" onClick={openCreate}>
              <IconPlus /> Add First Type
            </button>
          </div>
        ) : (
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

      {/* ── Footer count ── */}
      {rows.length > 0 && (
        <p className="et-count">
          {rows.length} employment type{rows.length !== 1 ? "s" : ""} configured
          &nbsp;·&nbsp;
          {rows.filter(r => r.status === "Active").length} active
        </p>
      )}
    </div>
  );
}