import { useState } from "react";

/* ── Tiny SVG icon helper ── */
const Ico = ({ d, size = 16, color = "currentColor", fill = "none" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={fill}
    stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    {Array.isArray(d) ? d.map((p, i) => <path key={i} d={p} />) : <path d={d} />}
  </svg>
);

const PlusIcon   = ({ s = 15 }) => <Ico size={s} d={["M12 5v14", "M5 12h14"]} />;
const EditIcon   = ({ s = 14 }) => <Ico size={s} d={["M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7", "M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"]} />;
const TrashIcon  = ({ s = 14 }) => <Ico size={s} d={["M3 6h18", "M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6", "M8 6V4a2 2 0 012-2h4a2 2 0 012 2v2"]} />;
const CloseIcon  = ({ s = 16 }) => <Ico size={s} d={["M18 6L6 18", "M6 6l12 12"]} />;
const PolicyIcon = ({ s = 16 }) => <Ico size={s} d={["M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z", "M14 2v6h6", "M16 13H8", "M16 17H8", "M10 9H8"]} />;
const DeptIcon   = ({ s = 16 }) => <Ico size={s} d={["M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z", "M9 22V12h6v10"]} />;
const DesigIcon  = ({ s = 16 }) => <Ico size={s} d={["M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2", "M12 11a4 4 0 100-8 4 4 0 000 8z"]} />;
const CheckIcon  = ({ s = 14 }) => <Ico size={s} d="M20 6L9 17l-5-5" />;

/* ── Seed data ── */
const seedPolicies = [
  { id: 1, name: "Corporate 2025",   compOff: 21, sickLeave: 10, casualLeave: 7, earnedLeave: 15, status: "Active"   },
  { id: 2, name: "Probation Policy", compOff: 12, sickLeave: 6,  casualLeave: 4, earnedLeave: 0,  status: "Active"   },
  { id: 3, name: "Contract Staff",   compOff: 15, sickLeave: 7,  casualLeave: 5, earnedLeave: 8,  status: "Inactive" },
];

const seedDepts = [
  { id: 1, name: "Engineering",     code: "ENG", head: "Arjun Sharma",  employees: 42, costCenter: "CC-001", leavePolicy: "Corporate 2025",   status: "Active"   },
  { id: 2, name: "Product",         code: "PRD", head: "Meera Pillai",  employees: 18, costCenter: "CC-002", leavePolicy: "Corporate 2025",   status: "Active"   },
  { id: 3, name: "Design",          code: "DSN", head: "Rahul Verma",   employees: 11, costCenter: "CC-003", leavePolicy: "Probation Policy", status: "Active"   },
  { id: 4, name: "Marketing",       code: "MKT", head: "Sunita Rao",    employees: 14, costCenter: "CC-004", leavePolicy: "Corporate 2025",   status: "Active"   },
  { id: 5, name: "Human Resources", code: "HR",  head: "Priya Nair",    employees: 8,  costCenter: "CC-005", leavePolicy: "Corporate 2025",   status: "Active"   },
  { id: 6, name: "Finance",         code: "FIN", head: "Vikram Joshi",  employees: 12, costCenter: "CC-006", leavePolicy: "Contract Staff",   status: "Inactive" },
];

const seedDesigs = [
  { id: 1, name: "Software Engineer",        dept: "Engineering",     status: "Active"   },
  { id: 2, name: "Senior Software Engineer", dept: "Engineering",     status: "Active"   },
  { id: 3, name: "Engineering Manager",      dept: "Engineering",     status: "Active"   },
  { id: 4, name: "Product Manager",          dept: "Product",         status: "Active"   },
  { id: 5, name: "UI/UX Designer",           dept: "Design",          status: "Active"   },
  { id: 6, name: "HR Executive",             dept: "Human Resources", status: "Active"   },
  { id: 7, name: "Marketing Analyst",        dept: "Marketing",       status: "Inactive" },
];

const TABS = [
  { id: "policy", label: "Leave Policies", Icon: PolicyIcon },
  { id: "dept",   label: "Departments",    Icon: DeptIcon   },
  { id: "desig",  label: "Designations",   Icon: DesigIcon  },
];

const DEFAULT_POLICY = { name: "", compOff: 0, sickLeave: 0, casualLeave: 0, earnedLeave: 0, status: "Active" };
const DEFAULT_DEPT   = { name: "", code: "", head: "", costCenter: "", leavePolicy: "", status: "Active" };
const DEFAULT_DESIG  = { name: "", dept: "", status: "Active" };

const styles = `
  .pc-root { padding: 0; font-family: 'Inter', system-ui, sans-serif; }
  .pc-tabs { display: flex; gap: 4px; margin-bottom: 28px; background: var(--dash-surface2, #1e2433); border-radius: 10px; padding: 5px; width: fit-content; }
  .pc-tab { display: flex; align-items: center; gap: 7px; padding: 8px 18px; border-radius: 7px; border: none; background: transparent; color: var(--dash-muted, #8892a4); font-size: 13.5px; font-weight: 500; cursor: pointer; transition: all 0.18s; }
  .pc-tab:hover { color: var(--dash-text, #e8ecf4); }
  .pc-tab.active { background: var(--dash-accent, #3b5bdb); color: #fff; box-shadow: 0 2px 12px #3b5bdb44; }
  .pc-sec-head { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 22px; }
  .pc-sec-title { font-size: 17px; font-weight: 700; color: var(--dash-text, #e8ecf4); margin-bottom: 3px; }
  .pc-sec-sub { font-size: 13px; color: var(--dash-muted, #8892a4); }
  .pc-add-btn { display: flex; align-items: center; gap: 7px; padding: 9px 18px; background: var(--dash-accent, #3b5bdb); color: #fff; border: none; border-radius: 8px; font-size: 13.5px; font-weight: 600; cursor: pointer; transition: opacity 0.15s, transform 0.15s; }
  .pc-add-btn:hover { opacity: 0.88; transform: translateY(-1px); }
  .pc-policy-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(290px, 1fr)); gap: 16px; }
  .pc-policy-card { background: var(--dash-surface, #161c2d); border: 1px solid var(--dash-border, #242d42); border-radius: 12px; padding: 18px 20px; transition: border-color 0.18s, box-shadow 0.18s; }
  .pc-policy-card:hover { border-color: var(--dash-accent, #3b5bdb); box-shadow: 0 0 0 3px #3b5bdb14; }
  .pc-pc-top { display: flex; justify-content: space-between; align-items: center; margin-bottom: 14px; }
  .pc-pc-name { font-size: 15px; font-weight: 700; color: var(--dash-text, #e8ecf4); }
  .pc-pc-actions { display: flex; gap: 6px; align-items: center; }
  .pc-pc-stats { display: flex; gap: 10px; }
  .pc-stat-chip { flex: 1; display: flex; flex-direction: column; align-items: center; gap: 2px; padding: 10px 6px; border-radius: 8px; font-weight: 700; }
  .pc-stat-chip span { font-size: 20px; }
  .pc-stat-chip small { font-size: 10px; font-weight: 500; opacity: 0.75; text-transform: uppercase; letter-spacing: 0.05em; }
  .pc-stat-chip.blue   { background: #3b5bdb18; color: #7c9cff; }
  .pc-stat-chip.amber  { background: #f59e0b18; color: #fbbf24; }
  .pc-stat-chip.green  { background: #10b98118; color: #34d399; }
  .pc-stat-chip.purple { background: #8b5cf618; color: #a78bfa; }
  .pc-table-wrap { background: var(--dash-surface, #161c2d); border: 1px solid var(--dash-border, #242d42); border-radius: 12px; overflow: hidden; }
  .pc-table { width: 100%; border-collapse: collapse; font-size: 13.5px; }
  .pc-table thead tr { background: var(--dash-surface2, #1e2433); border-bottom: 1px solid var(--dash-border, #242d42); }
  .pc-table th { padding: 13px 18px; text-align: left; font-size: 11.5px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.07em; color: var(--dash-muted, #8892a4); }
  .pc-table td { padding: 13px 18px; color: var(--dash-text, #e8ecf4); border-bottom: 1px solid var(--dash-border, #242d42); }
  .pc-table tbody tr:last-child td { border-bottom: none; }
  .pc-table tbody tr { transition: background 0.12s; }
  .pc-table tbody tr:hover { background: var(--dash-surface2, #1e2433); }
  .pc-dept-name { font-weight: 600; }
  .pc-code-badge { display: inline-block; padding: 3px 10px; background: var(--dash-surface2, #1e2433); border: 1px solid var(--dash-border, #242d42); border-radius: 6px; font-size: 12px; font-weight: 600; font-family: 'JetBrains Mono', monospace; color: var(--dash-accent, #7c9cff); }
  .pc-row-actions { display: flex; gap: 6px; justify-content: flex-end; }
  .pc-icon-btn { display: flex; align-items: center; justify-content: center; width: 30px; height: 30px; border-radius: 7px; border: 1px solid var(--dash-border, #242d42); background: var(--dash-surface2, #1e2433); color: var(--dash-muted, #8892a4); cursor: pointer; transition: all 0.15s; }
  .pc-icon-btn:hover { color: var(--dash-text, #e8ecf4); border-color: #8892a4; }
  .pc-icon-btn.danger:hover { color: #f87171; border-color: #f8717155; background: #ef444412; }
  .pc-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.65); backdrop-filter: blur(3px); z-index: 1000; display: flex; align-items: center; justify-content: center; animation: fadeIn 0.15s ease; }
  .pc-modal { background: var(--dash-surface, #161c2d); border: 1px solid var(--dash-border, #242d42); border-radius: 14px; width: 480px; max-width: 96vw; box-shadow: 0 24px 64px rgba(0,0,0,0.6); animation: slideUp 0.2s ease; }
  .pc-modal-sm { width: 360px; padding: 28px; text-align: center; }
  .pc-modal-head { display: flex; justify-content: space-between; align-items: center; padding: 20px 24px 16px; border-bottom: 1px solid var(--dash-border, #242d42); font-size: 15px; font-weight: 700; color: var(--dash-text, #e8ecf4); }
  .pc-modal-body { padding: 20px 24px; display: flex; flex-direction: column; gap: 14px; }
  .pc-modal-foot { display: flex; justify-content: flex-end; gap: 10px; padding: 16px 24px; border-top: 1px solid var(--dash-border, #242d42); }
  .pc-label { font-size: 12.5px; font-weight: 600; color: var(--dash-muted, #8892a4); margin-bottom: 5px; display: block; }
  .pc-required { color: #f87171; margin-left: 2px; }
  .pc-input { width: 100%; padding: 9px 13px; background: var(--dash-surface2, #1e2433); border: 1px solid var(--dash-border, #242d42); border-radius: 8px; color: var(--dash-text, #e8ecf4); font-size: 13.5px; outline: none; transition: border-color 0.15s; box-sizing: border-box; }
  .pc-input:focus { border-color: var(--dash-accent, #3b5bdb); box-shadow: 0 0 0 3px #3b5bdb22; }
  select.pc-input { cursor: pointer; }
  .pc-form-row { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 12px; }
  .pc-form-row > div { display: flex; flex-direction: column; }
  .pc-form-row-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
  .pc-form-row-2 > div { display: flex; flex-direction: column; }
  .pc-cancel-btn { padding: 9px 18px; background: var(--dash-surface2, #1e2433); border: 1px solid var(--dash-border, #242d42); color: var(--dash-text, #e8ecf4); border-radius: 8px; font-size: 13.5px; font-weight: 600; cursor: pointer; transition: opacity 0.15s; }
  .pc-cancel-btn:hover { opacity: 0.8; }
  .pc-save-btn { display: flex; align-items: center; gap: 7px; padding: 9px 20px; background: var(--dash-accent, #3b5bdb); color: #fff; border: none; border-radius: 8px; font-size: 13.5px; font-weight: 600; cursor: pointer; transition: opacity 0.15s; }
  .pc-save-btn:hover { opacity: 0.88; }
  .pc-delete-btn { padding: 9px 18px; background: #dc2626; color: #fff; border: none; border-radius: 8px; font-size: 13.5px; font-weight: 600; cursor: pointer; transition: opacity 0.15s; }
  .pc-delete-btn:hover { opacity: 0.88; }
  .pc-del-icon  { font-size: 36px; margin-bottom: 10px; }
  .pc-del-title { font-size: 17px; font-weight: 700; color: var(--dash-text, #e8ecf4); margin-bottom: 6px; }
  .pc-del-sub   { font-size: 13px; color: var(--dash-muted, #8892a4); margin-bottom: 20px; }
  .pc-status-badge { display: inline-block; padding: 3px 10px; border-radius: 20px; font-size: 11px; font-weight: 600; }
  .pc-status-badge.active   { background: #10b98118; color: #34d399; }
  .pc-status-badge.inactive { background: #ef444418; color: #f87171; }
  @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
  @keyframes slideUp { from { transform: translateY(18px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
  .fade-up { animation: slideUp 0.25s ease; }
`;

export default function PolicyConfig() {
  const [tab, setTab] = useState("policy");

  const [policies,      setPolicies]      = useState(seedPolicies);
  const [policyModal,   setPolicyModal]   = useState(false);
  const [editingPolicy, setEditingPolicy] = useState(null);
  const [pForm,         setPForm]         = useState(DEFAULT_POLICY);

  const [depts,       setDepts]       = useState(seedDepts);
  const [deptModal,   setDeptModal]   = useState(false);
  const [editingDept, setEditingDept] = useState(null);
  const [dForm,       setDForm]       = useState(DEFAULT_DEPT);

  const [desigs,       setDesigs]       = useState(seedDesigs);
  const [desigModal,   setDesigModal]   = useState(false);
  const [editingDesig, setEditingDesig] = useState(null);
  const [dgForm,       setDgForm]       = useState(DEFAULT_DESIG);

  const [deleteTarget, setDeleteTarget] = useState(null);

  const openAddPolicy  = () => { setEditingPolicy(null); setPForm(DEFAULT_POLICY); setPolicyModal(true); };
  const openEditPolicy = p  => { setEditingPolicy(p.id); setPForm({ ...p });       setPolicyModal(true); };
  const savePolicy = () => {
    if (!pForm.name.trim()) return;
    if (editingPolicy) setPolicies(ps => ps.map(p => p.id === editingPolicy ? { ...pForm, id: p.id } : p));
    else setPolicies(ps => [...ps, { ...pForm, id: Date.now() }]);
    setPolicyModal(false);
  };

  const openAddDept  = () => { setEditingDept(null); setDForm(DEFAULT_DEPT); setDeptModal(true); };
  const openEditDept = d  => { setEditingDept(d.id); setDForm({ ...d });     setDeptModal(true); };
  const saveDept = () => {
    if (!dForm.name.trim() || !dForm.code.trim()) return;
    if (editingDept) setDepts(ds => ds.map(d => d.id === editingDept ? { ...dForm, id: d.id, employees: d.employees } : d));
    else setDepts(ds => [...ds, { ...dForm, id: Date.now(), employees: 0 }]);
    setDeptModal(false);
  };

  const openAddDesig  = () => { setEditingDesig(null); setDgForm(DEFAULT_DESIG); setDesigModal(true); };
  const openEditDesig = d  => { setEditingDesig(d.id); setDgForm({ ...d });      setDesigModal(true); };
  const saveDesig = () => {
    if (!dgForm.name.trim()) return;
    if (editingDesig) setDesigs(ds => ds.map(d => d.id === editingDesig ? { ...dgForm, id: d.id } : d));
    else setDesigs(ds => [...ds, { ...dgForm, id: Date.now() }]);
    setDesigModal(false);
  };

  const confirmDelete = () => {
    if (!deleteTarget) return;
    if (deleteTarget.type === "policy") setPolicies(ps => ps.filter(p => p.id !== deleteTarget.id));
    if (deleteTarget.type === "dept")   setDepts(ds   => ds.filter(d => d.id !== deleteTarget.id));
    if (deleteTarget.type === "desig")  setDesigs(ds  => ds.filter(d => d.id !== deleteTarget.id));
    setDeleteTarget(null);
  };

  const activePolicies = policies.filter(p => p.status === "Active");

  return (
    <>
      <style>{styles}</style>
      <div className="pc-root">
        <div className="pc-tabs">
          {TABS.map(({ id, label, Icon }) => (
            <button key={id} className={`pc-tab${tab === id ? " active" : ""}`} onClick={() => setTab(id)}>
              <Icon s={15} /> {label}
            </button>
          ))}
        </div>

        {tab === "policy" && (
          <div className="pc-section fade-up">
            <div className="pc-sec-head">
              <div>
                <div className="pc-sec-title">Leave Policies</div>
                <div className="pc-sec-sub">Define leave entitlements for your organisation</div>
              </div>
              <button className="pc-add-btn" onClick={openAddPolicy}><PlusIcon /> New Policy</button>
            </div>
            <div className="pc-policy-grid">
              {policies.map(p => (
                <div className="pc-policy-card" key={p.id}>
                  <div className="pc-pc-top">
                    <div className="pc-pc-name">{p.name}</div>
                    <div className="pc-pc-actions">
                      <span className={`pc-status-badge ${p.status === "Active" ? "active" : "inactive"}`}>{p.status}</span>
                      <button className="pc-icon-btn" onClick={() => openEditPolicy(p)}><EditIcon /></button>
                      <button className="pc-icon-btn danger" onClick={() => setDeleteTarget({ type: "policy", id: p.id })}><TrashIcon /></button>
                    </div>
                  </div>
                  <div className="pc-pc-stats">
                    <div className="pc-stat-chip blue"><span>{p.compOff}</span><small>Comp Off</small></div>
                    <div className="pc-stat-chip amber"><span>{p.sickLeave}</span><small>Sick</small></div>
                    <div className="pc-stat-chip green"><span>{p.casualLeave}</span><small>Casual</small></div>
                    <div className="pc-stat-chip purple"><span>{p.earnedLeave}</span><small>Earned</small></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {tab === "dept" && (
          <div className="pc-section fade-up">
            <div className="pc-sec-head">
              <div>
                <div className="pc-sec-title">Departments</div>
                <div className="pc-sec-sub">Manage organisational departments and cost centres</div>
              </div>
              <button className="pc-add-btn" onClick={openAddDept}><PlusIcon /> New Department</button>
            </div>
            <div className="pc-table-wrap">
              <table className="pc-table">
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
                  {depts.map(d => (
                    <tr key={d.id}>
                      <td><span className="pc-dept-name">{d.name}</span></td>
                      <td><span className="pc-code-badge">{d.code}</span></td>
                      <td>{d.head}</td>
                      <td>{d.leavePolicy || <span style={{color:"#8892a4",fontStyle:"italic"}}>—</span>}</td>
                      <td><span className={`pc-status-badge ${d.status === "Active" ? "active" : "inactive"}`}>{d.status}</span></td>
                      <td>
                        <div className="pc-row-actions">
                          <button className="pc-icon-btn" onClick={() => openEditDept(d)}><EditIcon /></button>
                          <button className="pc-icon-btn danger" onClick={() => setDeleteTarget({ type: "dept", id: d.id })}><TrashIcon /></button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {tab === "desig" && (
          <div className="pc-section fade-up">
            <div className="pc-sec-head">
              <div>
                <div className="pc-sec-title">Designations</div>
                <div className="pc-sec-sub">Configure job titles and assignments</div>
              </div>
              <button className="pc-add-btn" onClick={openAddDesig}><PlusIcon /> New Designation</button>
            </div>
            <div className="pc-table-wrap">
              <table className="pc-table">
                <thead>
                  <tr>
                    <th>Designation</th>
                    <th>Department</th>
                    <th>Status</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {desigs.map(d => (
                    <tr key={d.id}>
                      <td><span className="pc-dept-name">{d.name}</span></td>
                      <td>{d.dept || <span style={{color:"#8892a4",fontStyle:"italic"}}>—</span>}</td>
                      <td><span className={`pc-status-badge ${d.status === "Active" ? "active" : "inactive"}`}>{d.status}</span></td>
                      <td>
                        <div className="pc-row-actions">
                          <button className="pc-icon-btn" onClick={() => openEditDesig(d)}><EditIcon /></button>
                          <button className="pc-icon-btn danger" onClick={() => setDeleteTarget({ type: "desig", id: d.id })}><TrashIcon /></button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* LEAVE POLICY MODAL */}
      {policyModal && (
        <div className="pc-overlay" onClick={() => setPolicyModal(false)}>
          <div className="pc-modal" onClick={e => e.stopPropagation()}>
            <div className="pc-modal-head">
              <span>{editingPolicy ? "Edit Leave Policy" : "New Leave Policy"}</span>
              <button className="pc-icon-btn" onClick={() => setPolicyModal(false)}><CloseIcon /></button>
            </div>
            <div className="pc-modal-body">
              <div>
                <label className="pc-label">Policy Name <span className="pc-required">*</span></label>
                <input className="pc-input" placeholder="e.g. Corporate 2026"
                  value={pForm.name} onChange={e => setPForm({ ...pForm, name: e.target.value })} />
              </div>
              <div className="pc-form-row">
                <div>
                  <label className="pc-label">Comp Off (days)</label>
                  <input className="pc-input" type="number" min="0"
                    value={pForm.compOff} onChange={e => setPForm({ ...pForm, compOff: +e.target.value })} />
                </div>
                <div>
                  <label className="pc-label">Sick Leave (days)</label>
                  <input className="pc-input" type="number" min="0"
                    value={pForm.sickLeave} onChange={e => setPForm({ ...pForm, sickLeave: +e.target.value })} />
                </div>
                <div>
                  <label className="pc-label">Casual Leave (days)</label>
                  <input className="pc-input" type="number" min="0"
                    value={pForm.casualLeave} onChange={e => setPForm({ ...pForm, casualLeave: +e.target.value })} />
                </div>
              </div>
              <div className="pc-form-row-2">
                <div>
                  <label className="pc-label">Earned Leave (days)</label>
                  <input className="pc-input" type="number" min="0"
                    value={pForm.earnedLeave} onChange={e => setPForm({ ...pForm, earnedLeave: +e.target.value })} />
                </div>
                <div>
                  <label className="pc-label">Status <span className="pc-required">*</span></label>
                  <select className="pc-input" value={pForm.status} onChange={e => setPForm({ ...pForm, status: e.target.value })}>
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                  </select>
                </div>
              </div>
            </div>
            <div className="pc-modal-foot">
              <button className="pc-cancel-btn" onClick={() => setPolicyModal(false)}>Cancel</button>
              <button className="pc-save-btn" onClick={savePolicy}>
                <CheckIcon /> {editingPolicy ? "Update" : "Create"} Policy
              </button>
            </div>
          </div>
        </div>
      )}

      {/* DEPARTMENT MODAL — updated fields */}
      {deptModal && (
        <div className="pc-overlay" onClick={() => setDeptModal(false)}>
          <div className="pc-modal" onClick={e => e.stopPropagation()}>
            <div className="pc-modal-head">
              <span>{editingDept ? "Edit Department" : "New Department"}</span>
              <button className="pc-icon-btn" onClick={() => setDeptModal(false)}><CloseIcon /></button>
            </div>
            <div className="pc-modal-body">
              <div>
                <label className="pc-label">Department Name <span className="pc-required">*</span></label>
                <input className="pc-input" placeholder="e.g. Engineering"
                  value={dForm.name} onChange={e => setDForm({ ...dForm, name: e.target.value })} />
              </div>
              <div>
                <label className="pc-label">Department Code <span className="pc-required">*</span></label>
                <input className="pc-input" placeholder="e.g. ENG"
                  value={dForm.code} onChange={e => setDForm({ ...dForm, code: e.target.value.toUpperCase() })} />
              </div>
              <div>
                <label className="pc-label">Leave Policy <span className="pc-required">*</span></label>
                <select className="pc-input" value={dForm.leavePolicy} onChange={e => setDForm({ ...dForm, leavePolicy: e.target.value })}>
                  <option value="">— Select Leave Policy —</option>
                  {activePolicies.map(p => (
                    <option key={p.id} value={p.name}>{p.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="pc-label">Status <span className="pc-required">*</span></label>
                <select className="pc-input" value={dForm.status} onChange={e => setDForm({ ...dForm, status: e.target.value })}>
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </select>
              </div>
            </div>
            <div className="pc-modal-foot">
              <button className="pc-cancel-btn" onClick={() => setDeptModal(false)}>Cancel</button>
              <button className="pc-save-btn" onClick={saveDept}>
                <CheckIcon /> {editingDept ? "Update" : "Create"} Department
              </button>
            </div>
          </div>
        </div>
      )}

      {/* DESIGNATION MODAL — updated fields */}
      {desigModal && (
        <div className="pc-overlay" onClick={() => setDesigModal(false)}>
          <div className="pc-modal" onClick={e => e.stopPropagation()}>
            <div className="pc-modal-head">
              <span>{editingDesig ? "Edit Designation" : "New Designation"}</span>
              <button className="pc-icon-btn" onClick={() => setDesigModal(false)}><CloseIcon /></button>
            </div>
            <div className="pc-modal-body">
              <div>
                <label className="pc-label">Designation Name <span className="pc-required">*</span></label>
                <input className="pc-input" placeholder="e.g. Senior Software Engineer"
                  value={dgForm.name} onChange={e => setDgForm({ ...dgForm, name: e.target.value })} />
              </div>
              <div>
                <label className="pc-label">Department <span className="pc-required">*</span></label>
                <select className="pc-input" value={dgForm.dept} onChange={e => setDgForm({ ...dgForm, dept: e.target.value })}>
                  <option value="">— Select Department —</option>
                  {depts.map(d => (
                    <option key={d.id} value={d.name}>{d.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="pc-label">Status <span className="pc-required">*</span></label>
                <select className="pc-input" value={dgForm.status} onChange={e => setDgForm({ ...dgForm, status: e.target.value })}>
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </select>
              </div>
            </div>
            <div className="pc-modal-foot">
              <button className="pc-cancel-btn" onClick={() => setDesigModal(false)}>Cancel</button>
              <button className="pc-save-btn" onClick={saveDesig}>
                <CheckIcon /> {editingDesig ? "Update" : "Create"} Designation
              </button>
            </div>
          </div>
        </div>
      )}

      {/* DELETE CONFIRM */}
      {deleteTarget && (
        <div className="pc-overlay" onClick={() => setDeleteTarget(null)}>
          <div className="pc-modal pc-modal-sm" onClick={e => e.stopPropagation()}>
            <div className="pc-del-icon">🗑</div>
            <div className="pc-del-title">Confirm Delete</div>
            <div className="pc-del-sub">This action cannot be undone. Are you sure?</div>
            <div className="pc-modal-foot">
              <button className="pc-cancel-btn" onClick={() => setDeleteTarget(null)}>Cancel</button>
              <button className="pc-delete-btn" onClick={confirmDelete}>Yes, Delete</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}