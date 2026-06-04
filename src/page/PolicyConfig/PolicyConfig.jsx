import { useState } from "react";
import "./PolicyConfig.css";
import LeavePolicy  from "./LeavePolicy/LeavePolicy";
import Department   from "./Department/Department";
import Designation  from "./Designation/Designation";

const Ico = ({ d, size = 16, color = "currentColor", fill = "none" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={fill}
    stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    {Array.isArray(d) ? d.map((p, i) => <path key={i} d={p} />) : <path d={d} />}
  </svg>
);

const PolicyIcon = ({ s = 16 }) => (
  <Ico size={s} d={["M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z","M14 2v6h6","M16 13H8","M16 17H8","M10 9H8"]} />
);
const DeptIcon = ({ s = 16 }) => (
  <Ico size={s} d={["M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z","M9 22V12h6v10"]} />
);
const DesigIcon = ({ s = 16 }) => (
  <Ico size={s} d={["M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2","M12 11a4 4 0 100-8 4 4 0 000 8z"]} />
);

const TABS = [
  { id: "policy", label: "Leave Policies", Icon: PolicyIcon },
  { id: "dept",   label: "Departments",    Icon: DeptIcon   },
  { id: "desig",  label: "Designations",   Icon: DesigIcon  },
];

export default function PolicyConfig() {
  const [tab, setTab] = useState("policy");

  return (
    <div className="pc-root">
      {/* ── Tab Bar ── */}
      <div className="pc-tabs">
        {TABS.map(({ id, label, Icon }) => (
          <button
            key={id}
            className={`pc-tab${tab === id ? " active" : ""}`}
            onClick={() => setTab(id)}
          >
            <Icon s={15} /> {label}
          </button>
        ))}
      </div>

      {/* ── Tab Content ── */}
      {tab === "policy" && <LeavePolicy />}
      {tab === "dept"   && <Department />}
      {tab === "desig"  && <Designation />}
    </div>
  );
}