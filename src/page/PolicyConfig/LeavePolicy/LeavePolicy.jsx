    import { useState, useCallback, useEffect } from "react";
    import "./LeavePolicy.css";
    import {
      fetchAllPolicies,
      createPolicy,
      updatePolicy,
      deletePolicy,
    } from "../../../api/leavePolicy";
    import { fetchAllLeaveTypes } from "../../../api/leaveTypes";

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
       CHIP COLOR CYCLE (for dynamic allocations)
    ════════════════════════════════════════════ */
    const CHIP_COLORS = ["blue", "amber", "green", "purple", "coral", "teal"];
    const chipColor = (i) => CHIP_COLORS[i % CHIP_COLORS.length];

    /* ════════════════════════════════════════════
       TOAST
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
      const [leaveTypes,    setLeaveTypes]    = useState([]);   // all active leave types
      const [ltLoading,     setLtLoading]     = useState(false);
      const [policyLoading, setPolicyLoading] = useState(false);
      const [policyError,   setPolicyError]   = useState(null);
      const [modal,         setModal]         = useState(false);
      const [editing,       setEditing]       = useState(null);
      const [policyName,    setPolicyName]    = useState("");
      const [policyStatus,  setPolicyStatus]  = useState("");
      /* allocations: [{ leaveTypeId, leaveTypeName, leaveTypeCode, days, _rowId }] */
      const [allocations,   setAllocations]   = useState([]);
      const [saving,        setSaving]        = useState(false);
      const [deleteTarget,  setDeleteTarget]  = useState(null);
      const [deleting,      setDeleting]      = useState(false);
      const [errors,        setErrors]        = useState({});
      const [toasts,        setToasts]        = useState([]);

      /* ── Toast helper ── */
      const toast = useCallback((msg, type = "success") => {
        const id = Date.now();
        setToasts(t => [...t, { id, msg, type }]);
        setTimeout(() => setToasts(t => t.filter(x => x.id !== id)), 3500);
      }, []);

      const loadLeaveTypes = useCallback(async () => {
        setLtLoading(true);
        try {
          const { leaveTypes: data } = await fetchAllLeaveTypes();
          setLeaveTypes((data || []).filter(lt => lt.status === "Active"));
        } catch {
        } finally {
          setLtLoading(false);
        }
      }, []);

      /* ── Load policies ── */
      const loadPolicies = useCallback(async () => {
        setPolicyLoading(true);
        setPolicyError(null);
        try {
          const { policies: loaded } = await fetchAllPolicies();
          setPolicies(loaded || []);
        } catch (err) {
          setPolicyError(err.response?.data?.message ?? err.message ?? "Failed to load policies");
        } finally {
          setPolicyLoading(false);
        }
      }, []);

      useEffect(() => {
        loadPolicies();
        loadLeaveTypes();
      }, [loadPolicies, loadLeaveTypes]);

      /* ════════════════════════════════════════
         MODAL HELPERS
      ════════════════════════════════════════ */
      const newRow = () => ({
        _rowId: Date.now() + Math.random(),
        leaveTypeId: "",
        leaveTypeName: "",
        leaveTypeCode: "",
        days: "",
      });

      const openAdd = () => {
        setEditing(null);
        setPolicyName("");
        setPolicyStatus("");
        setAllocations([newRow()]);
        setErrors({});
        setModal(true);
      };

      const openEdit = (p) => {
        setEditing(p);
        setPolicyName(p.name || "");
        setPolicyStatus(p.status || "");
        /* p.allocations: [{ leaveTypeId, leaveTypeName, leaveTypeCode, days }] */
        const rows = (p.allocations || []).map(a => ({ ...a, _rowId: Date.now() + Math.random() }));
        setAllocations(rows.length ? rows : [newRow()]);
        setErrors({});
        setModal(true);
      };

      /* ── Allocation row handlers ── */
      const handleLeaveTypeSelect = (rowId, leaveTypeId) => {
        const lt = leaveTypes.find(l => String(l.id) === String(leaveTypeId));
        setAllocations(rows => rows.map(r =>
          r._rowId === rowId
            ? { ...r, leaveTypeId: lt?.id || "", leaveTypeName: lt?.name || "", leaveTypeCode: lt?.code || "" }
            : r
        ));
        setErrors(e => ({ ...e, [`lt_${rowId}`]: "" }));
      };

      const handleDaysChange = (rowId, val) => {
        setAllocations(rows => rows.map(r => r._rowId === rowId ? { ...r, days: val } : r));
        setErrors(e => ({ ...e, [`days_${rowId}`]: "" }));
      };

      const addRow = () => setAllocations(rows => [...rows, newRow()]);

      const removeRow = (rowId) => setAllocations(rows => rows.filter(r => r._rowId !== rowId));

      /* ── Get used leave type IDs (to prevent duplicate selection) ── */
      const usedIds = (excludeRowId) =>
        allocations.filter(r => r._rowId !== excludeRowId && r.leaveTypeId).map(r => String(r.leaveTypeId));

      /* ════════════════════════════════════════
         VALIDATION
      ════════════════════════════════════════ */
      const validate = () => {
        const e = {};
        if (!policyName?.trim()) e.policyName = "Policy Name is required";
        if (!policyStatus)       e.policyStatus = "Status is required";

        if (allocations.length === 0) {
          e.allocations = "Add at least one leave type allocation";
        } else {
          allocations.forEach(r => {
            if (!r.leaveTypeId) e[`lt_${r._rowId}`]   = "Select a leave type";
            if (r.days === "" || r.days === null) e[`days_${r._rowId}`] = "Enter days";
          });
        }
        setErrors(e);
        return Object.keys(e).length === 0;
      };

      /* ════════════════════════════════════════
         SAVE
      ════════════════════════════════════════ */
      const save = async () => {
        if (!validate()) return;
        setSaving(true);

        const payload = {
          name: policyName,
          status: policyStatus,

          allocations: allocations.map(row => ({
            leaveTypeId: row.leaveTypeId,
            days: Number(row.days),
          })),
        };

        try {
          if (editing) {
            const updated = await updatePolicy(editing.id, payload);
            setPolicies(ps => ps.map(p => p.id === updated.id ? updated : p));
            toast("Policy updated successfully");
          } else {
            const created = await createPolicy(payload);
            setPolicies(ps => [...ps, created]);
            toast("Policy created successfully");
          }
          setModal(false);
        } catch (err) {
          toast(err.response?.data?.message ?? err.message ?? "Save failed", "error");
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
              <button className="lp-add-btn" onClick={openAdd} disabled={policyLoading}>
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
                        <button className="lp-icon-btn" onClick={() => openEdit(p)} title="Edit">
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

                    {/* Dynamic allocations */}
                    <div className="lp-pc-stats">
                      {(p.allocations || []).map((a, i) => (
                        <div key={a.leaveTypeId || i} className={`lp-stat-chip ${chipColor(i)}`}>
                          <span>{a.days}</span>
                          <small>{a.leaveTypeCode || a.leaveTypeName?.slice(0, 6)}</small>
                        </div>
                      ))}

                      {/* Fallback for legacy policies without allocations array */}
                      {(!p.allocations || p.allocations.length === 0) && (
                        <>
                          {p.compOff    !== undefined && <div className="lp-stat-chip blue">  <span>{p.compOff}</span>    <small>Comp Off</small> </div>}
                          {p.sickLeave  !== undefined && <div className="lp-stat-chip amber"> <span>{p.sickLeave}</span>  <small>Sick</small>     </div>}
                          {p.casualLeave !== undefined && <div className="lp-stat-chip green"> <span>{p.casualLeave}</span><small>Casual</small>   </div>}
                          {p.earnedLeave !== undefined && <div className="lp-stat-chip purple"><span>{p.earnedLeave}</span><small>Earned</small>   </div>}
                        </>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* ═══════════ MODAL: LEAVE POLICY ═══════════ */}
          {modal && (
            <div className="lp-overlay" onClick={() => !saving && setModal(false)}>
              <div className="lp-modal lp-modal-wide" onClick={e => e.stopPropagation()}>
                <div className="lp-modal-head">
                  <span>{editing ? "Edit Leave Policy" : "New Leave Policy"}</span>
                  <button className="lp-icon-btn" onClick={() => setModal(false)} disabled={saving}>
                    <CloseIcon />
                  </button>
                </div>

                <div className="lp-modal-body">
                  {/* Policy Name + Status row */}
                  <div className="lp-form-row-2">
                    <div>
                      <label className="lp-label">Policy Name <span className="lp-required">*</span></label>
                      <input
                        className={`lp-input${errors.policyName ? " error" : ""}`}
                        placeholder="e.g. Corporate 2026"
                        value={policyName}
                        onChange={e => { setPolicyName(e.target.value); setErrors(p => ({ ...p, policyName: "" })); }}
                      />
                      {errors.policyName && <div className="lp-field-error">{errors.policyName}</div>}
                    </div>
                    <div>
                      <label className="lp-label">Status <span className="lp-required">*</span></label>
                      <select
                        className={`lp-input${errors.policyStatus ? " error" : ""}`}
                        value={policyStatus}
                        onChange={e => { setPolicyStatus(e.target.value); setErrors(p => ({ ...p, policyStatus: "" })); }}
                      >
                        <option value="">— Select Status —</option>
                        <option value="Active">Active</option>
                        <option value="Inactive">Inactive</option>
                      </select>
                      {errors.policyStatus && <div className="lp-field-error">{errors.policyStatus}</div>}
                    </div>
                  </div>

                  {/* Dynamic leave allocation table */}
                  <div className="lp-alloc-section">
                    <div className="lp-alloc-header">
                      <span className="lp-alloc-title">Leave Allocation</span>
                      <span className="lp-alloc-sub">{allocations.filter(r => r.leaveTypeId).length} types configured</span>
                    </div>

                    {errors.allocations && (
                      <div className="lp-field-error" style={{ marginBottom: 8 }}>{errors.allocations}</div>
                    )}

                    <div className="lp-alloc-table-wrap">
                      <table className="lp-alloc-table">
                        <thead>
                          <tr>
                            <th>Leave Type</th>
                            <th style={{ width: 100 }}>Days</th>
                            <th style={{ width: 40 }}></th>
                          </tr>
                        </thead>
                        <tbody>
                          {allocations.map((row) => (
                            <tr key={row._rowId}>
                              <td>
                                <select
                                  className={`lp-input lp-alloc-select${errors[`lt_${row._rowId}`] ? " error" : ""}`}
                                  value={row.leaveTypeId}
                                  disabled={ltLoading}
                                  onChange={e => handleLeaveTypeSelect(row._rowId, e.target.value)}
                                >
                                  <option value="">
                                    {ltLoading ? "Loading…" : "— Select Leave Type —"}
                                  </option>
                                  {leaveTypes
                                    .filter(
                                      lt =>
                                        !usedIds(row._rowId).includes(String(lt.id))
                                    )
                                    .map(lt => (
                                      <option key={lt.id} value={lt.id}>
                                        {lt.name} ({lt.code})
                                      </option>
                                    ))}
                                </select>
                                {errors[`lt_${row._rowId}`] && (
                                  <div className="lp-field-error">{errors[`lt_${row._rowId}`]}</div>
                                )}
                              </td>
                              <td>
                                <input
                                  className={`lp-input lp-alloc-days${errors[`days_${row._rowId}`] ? " error" : ""}`}
                                  type="number"
                                  min="0"
                                  max="365"
                                  placeholder="0"
                                  value={row.days}
                                  onChange={e => handleDaysChange(row._rowId, e.target.value)}
                                />
                                {errors[`days_${row._rowId}`] && (
                                  <div className="lp-field-error">{errors[`days_${row._rowId}`]}</div>
                                )}
                              </td>
                              <td>
                                {allocations.length > 1 && (
                                  <button
                                    className="lp-icon-btn danger"
                                    onClick={() => removeRow(row._rowId)}
                                    title="Remove row"
                                    type="button"
                                  >
                                    <TrashIcon />
                                  </button>
                                )}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>

                    <button
                      className="lp-add-row-btn"
                      onClick={addRow}
                      type="button"
                      disabled={allocations.length >= leaveTypes.length && leaveTypes.length > 0}
                    >
                      <PlusIcon s={13} /> Add Leave Type
                    </button>
                  </div>
                </div>

                <div className="lp-modal-foot">
                  <button className="lp-cancel-btn" onClick={() => setModal(false)} disabled={saving}>
                    Cancel
                  </button>
                  <button className="lp-save-btn" onClick={save} disabled={saving}>
                    {saving ? <SpinIcon s={14} /> : <CheckIcon />}
                    {saving ? "Saving…" : editing ? "Update Policy" : "Create Policy"}
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