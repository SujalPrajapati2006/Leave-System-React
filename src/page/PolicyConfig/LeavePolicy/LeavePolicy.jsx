import { useState, useEffect, useCallback } from "react";
import "./LeavePolicy.css";
import {
  fetchAllPolicies,
  createPolicy,
  updatePolicy,
  deletePolicy,
} from "../../../api/leavePolicy";

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
const DEFAULT_POLICY_FORM = {
  policyName: "",
  compOffDays: "",
  sickLeaveDays: "",
  casualLeaveDays: "",
  earnedLeaveDays: "",
  status: "",
};

/* ════════════════════════════════════════════
   TOAST COMPONENT
════════════════════════════════════════════ */
function ToastStack({ toasts }) {
  return (
    <div className="lp-toast-stack">
      {toasts.map(t => (
        <div key={t.id} className={`lp-toast ${t.type}`}>{t.msg}</div>
      ))}
    </div>
  );
}

/* ════════════════════════════════════════════
   MAIN COMPONENT
════════════════════════════════════════════ */
export default function LeavePolicy() {
  const [policies,      setPolicies]      = useState([]);
  const [policyLoading, setPolicyLoading] = useState(false);
  const [policyError,   setPolicyError]   = useState(null);
  const [policyModal,   setPolicyModal]   = useState(false);
  const [editingPolicy, setEditingPolicy] = useState(null);
  const [pForm,         setPForm]         = useState(DEFAULT_POLICY_FORM);
  const [pSaving,       setPSaving]       = useState(false);
  const [deleteTarget,  setDeleteTarget]  = useState(null);
  const [deleting,      setDeleting]      = useState(false);
  const [errors,        setErrors]        = useState({});
  const [toasts,        setToasts]        = useState([]);

  const toast = useCallback((msg, type = "success") => {
    const id = Date.now();
    setToasts(t => [...t, { id, msg, type }]);
    setTimeout(() => setToasts(t => t.filter(x => x.id !== id)), 3500);
  }, []);

  /* ── Load ── */
  const loadPolicies = useCallback(async () => {
    setPolicyLoading(true);
    setPolicyError(null);
    try {
      const { policies: loaded } = await fetchAllPolicies();
      setPolicies(loaded || []);
    } catch (err) {
      const msg = err.response?.data?.message ?? err.message ?? "Failed to load policies";
      setPolicyError(msg);
    } finally {
      setPolicyLoading(false);
    }
  }, []);

  useEffect(() => { loadPolicies(); }, [loadPolicies]);

  /* ── Open modals ── */
  const openAddPolicy = () => {
    setEditingPolicy(null);
    setPForm(DEFAULT_POLICY_FORM);
    setErrors({});
    setPolicyModal(true);
  };

  const openEditPolicy = (p) => {
    setEditingPolicy(p);
    setPForm({
      policyName:      p.name || "",
      compOffDays:     p.compOff ?? "",
      sickLeaveDays:   p.sickLeave ?? "",
      casualLeaveDays: p.casualLeave ?? "",
      earnedLeaveDays: p.earnedLeave ?? "",
      status:          p.status || "",
    });
    setErrors({});
    setPolicyModal(true);
  };

  /* ── Validate ── */
  const validatePolicyForm = () => {
    const newErrors = {};
    if (!pForm.policyName?.trim())                                      newErrors.policyName      = "Policy Name is required";
    if (pForm.compOffDays === "" || pForm.compOffDays === null)         newErrors.compOffDays     = "Comp Off Days is required";
    if (pForm.sickLeaveDays === "" || pForm.sickLeaveDays === null)     newErrors.sickLeaveDays   = "Sick Leave Days is required";
    if (pForm.casualLeaveDays === "" || pForm.casualLeaveDays === null) newErrors.casualLeaveDays = "Casual Leave Days is required";
    if (pForm.earnedLeaveDays === "" || pForm.earnedLeaveDays === null) newErrors.earnedLeaveDays = "Earned Leave Days is required";
    if (!pForm.status)                                                   newErrors.status          = "Status is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  /* ── Save ── */
  const savePolicy = async () => {
    if (!validatePolicyForm()) return;
    setPSaving(true);
    try {
      if (editingPolicy) {
        const updated = await updatePolicy(editingPolicy.id, pForm);
        setPolicies(ps => ps.map(p => p.id === updated.id ? updated : p));
        toast("Policy updated successfully");
      } else {
        const created = await createPolicy(pForm);
        setPolicies(ps => [...ps, created]);
        toast("Policy created successfully");
      }
      setPolicyModal(false);
    } catch (err) {
      toast(err.response?.data?.message ?? err.message ?? "Save failed", "error");
    } finally {
      setPSaving(false);
    }
  };

  /* ── Delete ── */
  const confirmDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await deletePolicy(deleteTarget.id);
      setPolicies(ps => ps.filter(p => p.id !== deleteTarget.id));
      toast("Policy deleted");
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

      <div className="lp-section fade-up">
        {/* Header */}
        <div className="lp-sec-head">
          <div>
            <div className="lp-sec-title">Leave Policies</div>
            <div className="lp-sec-sub">Define leave entitlements for your organisation</div>
          </div>
          <button className="lp-add-btn" onClick={openAddPolicy} disabled={policyLoading}>
            <PlusIcon /> New Policy
          </button>
        </div>

        {/* Error banner */}
        {policyError && (
          <div className="lp-error-banner">
            <span>⚠ {policyError}</span>
            <button className="lp-retry-btn" onClick={loadPolicies}>Retry</button>
          </div>
        )}

        {/* Loading / Grid */}
        {policyLoading ? (
          <div className="lp-loading"><SpinIcon s={20} /> Loading policies…</div>
        ) : (
          <div className="lp-policy-grid">
            {policies.length === 0 && !policyError && (
              <div className="lp-empty">No policies yet. Create your first one!</div>
            )}
            {policies.map(p => (
              <div className="lp-policy-card" key={p.id}>
                <div className="lp-pc-top">
                  <div className="lp-pc-name" title={p.name}>{p.name}</div>
                  <div className="lp-pc-actions">
                    <span className={`lp-status-badge ${p.status === "Active" ? "active" : "inactive"}`}>
                      {p.status}
                    </span>
                    <button className="lp-icon-btn" onClick={() => openEditPolicy(p)} title="Edit">
                      <EditIcon />
                    </button>
                    <button
                      className="lp-icon-btn danger"
                      onClick={() => setDeleteTarget({ id: p.id, name: p.name })}
                      title="Delete"
                    >
                      <TrashIcon />
                    </button>
                  </div>
                </div>
                <div className="lp-pc-stats">
                  <div className="lp-stat-chip blue">   <span>{p.compOff}</span>     <small>Comp Off</small> </div>
                  <div className="lp-stat-chip amber">  <span>{p.sickLeave}</span>   <small>Sick</small>     </div>
                  <div className="lp-stat-chip green">  <span>{p.casualLeave}</span> <small>Casual</small>   </div>
                  <div className="lp-stat-chip purple"> <span>{p.earnedLeave}</span> <small>Earned</small>   </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ═══════════ MODAL: LEAVE POLICY ═══════════ */}
      {policyModal && (
        <div className="lp-overlay" onClick={() => !pSaving && setPolicyModal(false)}>
          <div className="lp-modal" onClick={e => e.stopPropagation()}>
            <div className="lp-modal-head">
              <span>{editingPolicy ? "Edit Leave Policy" : "New Leave Policy"}</span>
              <button className="lp-icon-btn" onClick={() => setPolicyModal(false)} disabled={pSaving}>
                <CloseIcon />
              </button>
            </div>

            <div className="lp-modal-body">
              {/* Policy Name */}
              <div>
                <label className="lp-label">Policy Name <span className="lp-required">*</span></label>
                <input
                  className={`lp-input${errors.policyName ? " error" : ""}`}
                  placeholder="e.g. Corporate 2026"
                  value={pForm.policyName}
                  onChange={e => { setPForm({ ...pForm, policyName: e.target.value }); setErrors(p => ({ ...p, policyName: "" })); }}
                />
                {errors.policyName && <div className="lp-field-error">{errors.policyName}</div>}
              </div>

              {/* 3-col row */}
              <div className="lp-form-row">
                <div>
                  <label className="lp-label">Comp Off (days) <span className="lp-required">*</span></label>
                  <input
                    className={`lp-input${errors.compOffDays ? " error" : ""}`}
                    type="number" min="0" value={pForm.compOffDays}
                    onChange={e => { setPForm({ ...pForm, compOffDays: e.target.value }); setErrors(p => ({ ...p, compOffDays: "" })); }}
                  />
                  {errors.compOffDays && <div className="lp-field-error">{errors.compOffDays}</div>}
                </div>
                <div>
                  <label className="lp-label">Sick Leave (days) <span className="lp-required">*</span></label>
                  <input
                    className={`lp-input${errors.sickLeaveDays ? " error" : ""}`}
                    type="number" min="0" value={pForm.sickLeaveDays}
                    onChange={e => { setPForm({ ...pForm, sickLeaveDays: e.target.value }); setErrors(p => ({ ...p, sickLeaveDays: "" })); }}
                  />
                  {errors.sickLeaveDays && <div className="lp-field-error">{errors.sickLeaveDays}</div>}
                </div>
                <div>
                  <label className="lp-label">Casual Leave (days) <span className="lp-required">*</span></label>
                  <input
                    className={`lp-input${errors.casualLeaveDays ? " error" : ""}`}
                    type="number" min="0" value={pForm.casualLeaveDays}
                    onChange={e => { setPForm({ ...pForm, casualLeaveDays: e.target.value }); setErrors(p => ({ ...p, casualLeaveDays: "" })); }}
                  />
                  {errors.casualLeaveDays && <div className="lp-field-error">{errors.casualLeaveDays}</div>}
                </div>
              </div>

              {/* 2-col row */}
              <div className="lp-form-row-2">
                <div>
                  <label className="lp-label">Earned Leave (days) <span className="lp-required">*</span></label>
                  <input
                    className={`lp-input${errors.earnedLeaveDays ? " error" : ""}`}
                    type="number" min="0" value={pForm.earnedLeaveDays}
                    onChange={e => { setPForm({ ...pForm, earnedLeaveDays: e.target.value }); setErrors(p => ({ ...p, earnedLeaveDays: "" })); }}
                  />
                  {errors.earnedLeaveDays && <div className="lp-field-error">{errors.earnedLeaveDays}</div>}
                </div>
                <div>
                  <label className="lp-label">Status <span className="lp-required">*</span></label>
                  <select
                    className={`lp-input${errors.status ? " error" : ""}`}
                    value={pForm.status}
                    onChange={e => { setPForm({ ...pForm, status: e.target.value }); setErrors(p => ({ ...p, status: "" })); }}
                  >
                    <option value="">— Select Status —</option>
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                  </select>
                  {errors.status && <div className="lp-field-error">{errors.status}</div>}
                </div>
              </div>
            </div>

            <div className="lp-modal-foot">
              <button className="lp-cancel-btn" onClick={() => setPolicyModal(false)} disabled={pSaving}>Cancel</button>
              <button className="lp-save-btn" onClick={savePolicy} disabled={pSaving}>
                {pSaving ? <SpinIcon s={14} /> : <CheckIcon />}
                {pSaving ? "Saving…" : editingPolicy ? "Update Policy" : "Create Policy"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ═══════════ MODAL: DELETE CONFIRM ═══════════ */}
      {deleteTarget && (
        <div className="lp-overlay" onClick={() => !deleting && setDeleteTarget(null)}>
          <div className="lp-modal lp-modal-sm" onClick={e => e.stopPropagation()}>
            <span className="lp-del-icon">🗑</span>
            <div className="lp-del-title">Confirm Delete</div>
            <div className="lp-del-sub">
              Delete <span className="lp-del-name">"{deleteTarget.name}"</span>?<br />
              This action cannot be undone.
            </div>
            <div className="lp-modal-foot" style={{ justifyContent: "center" }}>
              <button className="lp-cancel-btn" onClick={() => setDeleteTarget(null)} disabled={deleting}>Cancel</button>
              <button className="lp-delete-btn" onClick={confirmDelete} disabled={deleting}>
                {deleting ? "Deleting…" : "Yes, Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}