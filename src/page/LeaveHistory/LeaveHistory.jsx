import { useState, useEffect, useMemo } from "react";
import "./LeaveHistory.css";

// ══════════════════════════════════════════
//  Icons
// ══════════════════════════════════════════
const Icon = ({ d, size = 16, color = "currentColor", fill = "none", sw = "2" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={fill} stroke={color}
    strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round">
    {Array.isArray(d) ? d.map((p, i) => <path key={i} d={p} />) : <path d={d} />}
  </svg>
);

const SearchIcon   = (p) => <Icon size={p.size} color={p.color} d="M11 11m-8 0a8 8 0 1 0 16 0a8 8 0 1 0-16 0M21 21l-4.35-4.35" />;
const DownloadIcon = (p) => <Icon size={p.size} color={p.color} d={["M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4","M7 10l5 5 5-5","M12 15V3"]} />;
const GridIcon     = (p) => <Icon size={p.size} color={p.color} d={["M3 3h7v7H3z","M14 3h7v7h-7z","M14 14h7v7h-7z","M3 14h7v7H3z"]} />;
const ListIcon     = (p) => <Icon size={p.size} color={p.color} d={["M8 6h13","M8 12h13","M8 18h13","M3 6h.01","M3 12h.01","M3 18h.01"]} />;
const ChevLeft     = (p) => <Icon size={p.size} color={p.color} d="M15 18l-6-6 6-6" />;
const ChevRight    = (p) => <Icon size={p.size} color={p.color} d="M9 18l6-6-6-6" />;
const SortIcon     = (p) => <Icon size={p.size} color={p.color} d={["M3 6h18","M7 12h10","M11 18h2"]} />;
const CalIcon      = (p) => <Icon size={p.size} color={p.color} d={["M3 4h18v18H3z","M16 2v4","M8 2v4","M3 10h18"]} />;
const CheckIcon    = (p) => <Icon size={p.size} color={p.color} d="M20 6L9 17l-5-5" sw="2.5" />;
const XIcon        = (p) => <Icon size={p.size} color={p.color} d={["M18 6L6 18","M6 6l12 12"]} />;
const ClockIcon    = (p) => <Icon size={p.size} color={p.color} d={["M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20","M12 6v6l4 2"]} />;
const SparkIcon    = (p) => <Icon size={p.size} color={p.color} d="M12 2l3.09 6.26L22 9.27l-5 4.87L18.18 21 12 17.77 5.82 21 7 14.14 2 9.27l6.91-1.01L12 2z" />;

// ══════════════════════════════════════════
//  Config
// ══════════════════════════════════════════
const TYPE_COLORS = {
  "Casual Leave":    "#3b82f6",
  "Sick Leave":      "#f59e0b",
  "Earned Leave":    "#10b981",
  "Comp Off":        "#ec4899",
  "Maternity Leave": "#8b5cf6",
};

const STATUS_CFG = {
  approved:  { color: "#10b981", bg: "#ecfdf5", Icon: CheckIcon },
  rejected:  { color: "#ef4444", bg: "#fef2f2", Icon: XIcon    },
  cancelled: { color: "#6b7280", bg: "#f9fafb", Icon: XIcon    },
};

// ══════════════════════════════════════════
//  Mock data  (swap with API call)
// ══════════════════════════════════════════
const MOCK_HISTORY = [
  { id:"LV-2025-001", type:"Casual Leave",   from:"2025-06-10", to:"2025-06-12", days:3,   status:"approved",  reason:"Family function — cousin's wedding",       approvedBy:"Ravi Sharma",  appliedOn:"2025-06-01" },
  { id:"LV-2025-002", type:"Sick Leave",     from:"2025-07-03", to:"2025-07-04", days:2,   status:"approved",  reason:"Fever and viral flu",                      approvedBy:"Ravi Sharma",  appliedOn:"2025-07-03" },
  { id:"LV-2025-003", type:"Earned Leave",   from:"2025-08-18", to:"2025-08-22", days:5,   status:"approved",  reason:"Annual vacation trip to Goa",               approvedBy:"Ravi Sharma",  appliedOn:"2025-08-10" },
  { id:"LV-2025-004", type:"Casual Leave",   from:"2025-09-05", to:"2025-09-05", days:0.5, status:"approved",  reason:"Personal work (half day afternoon)",        approvedBy:"Ravi Sharma",  appliedOn:"2025-09-04" },
  { id:"LV-2025-005", type:"Casual Leave",   from:"2025-04-14", to:"2025-04-15", days:2,   status:"rejected",  reason:"Out of town for personal work",             approvedBy:"Ravi Sharma",  appliedOn:"2025-04-10" },
  { id:"LV-2025-006", type:"Comp Off",       from:"2025-05-20", to:"2025-05-20", days:1,   status:"cancelled", reason:"Weekend comp off — self cancelled",         approvedBy:null,           appliedOn:"2025-05-18" },
  { id:"LV-2025-007", type:"Earned Leave",   from:"2025-03-10", to:"2025-03-12", days:3,   status:"approved",  reason:"Long weekend family trip",                  approvedBy:"Ravi Sharma",  appliedOn:"2025-03-05" },
  { id:"LV-2025-008", type:"Sick Leave",     from:"2025-02-19", to:"2025-02-19", days:1,   status:"approved",  reason:"Migraine — doctor's advice",                approvedBy:"Ravi Sharma",  appliedOn:"2025-02-19" },
  { id:"LV-2025-009", type:"Casual Leave",   from:"2025-01-26", to:"2025-01-26", days:1,   status:"approved",  reason:"Republic day extended leave",               approvedBy:"Ravi Sharma",  appliedOn:"2025-01-24" },
  { id:"LV-2024-012", type:"Earned Leave",   from:"2024-12-23", to:"2024-12-27", days:5,   status:"approved",  reason:"Christmas & New Year holidays",             approvedBy:"Ravi Sharma",  appliedOn:"2024-12-15" },
  { id:"LV-2024-011", type:"Sick Leave",     from:"2024-11-08", to:"2024-11-09", days:2,   status:"approved",  reason:"Food poisoning",                            approvedBy:"Ravi Sharma",  appliedOn:"2024-11-08" },
  { id:"LV-2024-010", type:"Casual Leave",   from:"2024-10-02", to:"2024-10-03", days:2,   status:"rejected",  reason:"Personal errands",                          approvedBy:"Ravi Sharma",  appliedOn:"2024-09-28" },
];

const YEARS = ["2025", "2024", "2023"];
const PER_PAGE = 8;

// ══════════════════════════════════════════
//  Helpers
// ══════════════════════════════════════════
function fmt(dateStr) {
  if (!dateStr) return "—";
  return new Date(dateStr).toLocaleDateString("en-IN", { day:"2-digit", month:"short", year:"numeric" });
}
function monthLabel(dateStr) {
  return new Date(dateStr).toLocaleDateString("en-IN", { month:"long", year:"numeric" });
}
function groupByMonth(arr) {
  const map = {};
  arr.forEach(l => {
    const key = monthLabel(l.from);
    if (!map[key]) map[key] = [];
    map[key].push(l);
  });
  return map;
}

// ══════════════════════════════════════════
//  Sub-components
// ══════════════════════════════════════════

/** Animated donut chart using SVG */
function DonutChart({ data, total, animated }) {
  const size = 110, stroke = 14, r = (size - stroke) / 2;
  const circ = 2 * Math.PI * r;
  let offset = 0;
  const slices = data.map(d => {
    const pct   = total ? d.days / total : 0;
    const dash  = pct * circ;
    const gap   = circ - dash;
    const start = offset;
    offset += dash;
    return { ...d, dash, gap, start };
  });

  return (
    <div className="lh-chart-wrap">
      <div>
        <div className="lh-chart-title">Days by Leave Type</div>
        <svg width={size} height={size} style={{ transform:"rotate(-90deg)" }}>
          <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="#f0f0f0" strokeWidth={stroke} />
          {animated && slices.map((sl, i) => (
            <circle
              key={i}
              cx={size/2} cy={size/2} r={r}
              fill="none"
              stroke={sl.color}
              strokeWidth={stroke}
              strokeDasharray={`${sl.dash} ${sl.gap}`}
              strokeDashoffset={-sl.start}
              strokeLinecap="butt"
              style={{ transition:`stroke-dasharray 0.9s ease ${i*0.1}s` }}
            />
          ))}
          {/* Center label */}
          <text x={size/2} y={size/2 - 4}
            textAnchor="middle" dominantBaseline="middle"
            style={{ transform:"rotate(90deg)", transformOrigin:`${size/2}px ${size/2}px`, fill:"#1a1a1a", fontSize:18, fontWeight:800 }}>
            {total}
          </text>
          <text x={size/2} y={size/2 + 14}
            textAnchor="middle" dominantBaseline="middle"
            style={{ transform:"rotate(90deg)", transformOrigin:`${size/2}px ${size/2}px`, fill:"#9ca3af", fontSize:9, fontWeight:700 }}>
            DAYS
          </text>
        </svg>
      </div>

      {/* Legend with mini bars */}
      <div className="lh-legend" style={{ flex:1 }}>
        {data.map(d => (
          <div key={d.type}>
            <div className="lh-legend-item">
              <div className="lh-legend-left">
                <div className="lh-legend-pip" style={{ background: d.color }} />
                <span className="lh-legend-name">{d.type}</span>
              </div>
              <span className="lh-legend-days">{d.days}d</span>
            </div>
            <div className="lh-legend-bar-wrap">
              <div className="lh-legend-bar-track">
                <div
                  className="lh-legend-bar-fill"
                  style={{ width: animated ? `${total ? (d.days/total)*100 : 0}%` : "0%", background: d.color }}
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/** Analytics stat card */
function StatCard({ icon: IconComp, iconBg, iconColor, value, label, sub, color }) {
  return (
    <div className="lh-stat">
      <div className="lh-stat-icon" style={{ background: iconBg }}>
        <IconComp size={15} color={iconColor} />
      </div>
      <div className="lh-stat-value" style={{ color }}>{value}</div>
      <div className="lh-stat-label">{label}</div>
      {sub && <div className="lh-stat-sub">{sub}</div>}
    </div>
  );
}

/** Status badge */
function StatusBadge({ status }) {
  const cfg = STATUS_CFG[status];
  const BadgeIcon = cfg.Icon;
  return (
    <span className="lh-status-badge" style={{ background: cfg.bg, color: cfg.color }}>
      <BadgeIcon size={11} color={cfg.color} />
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
}

/** Single table row */
function TableRow({ leave, idx }) {
  const typeColor = TYPE_COLORS[leave.type] || "#6b7280";
  return (
    <tr style={{ animationDelay: `${idx * 0.04}s` }}>
      <td><span className="lh-td-id">{leave.id}</span></td>
      <td>
        <span className="lh-type-dot">
          <span className="lh-type-pip" style={{ background: typeColor }} />
          {leave.type}
        </span>
      </td>
      <td style={{ whiteSpace:"nowrap" }}>{fmt(leave.from)}</td>
      <td style={{ whiteSpace:"nowrap" }}>{fmt(leave.to)}</td>
      <td><span className="lh-days-badge">{leave.days}{leave.days === 0.5 ? " ½" : "d"}</span></td>
      <td><StatusBadge status={leave.status} /></td>
      <td className="lh-reason-cell" title={leave.reason}>{leave.reason}</td>
      <td style={{ fontSize:12, color:"#9ca3af", whiteSpace:"nowrap" }}>{fmt(leave.appliedOn)}</td>
    </tr>
  );
}

/** Single grid card */
function GridCard({ leave, idx }) {
  const typeColor = TYPE_COLORS[leave.type] || "#6b7280";
  return (
    <div
      className="lh-grid-card"
      style={{ borderLeftColor: typeColor, animationDelay: `${idx * 0.06}s` }}
    >
      <div className="lh-gc-header">
        <div>
          <div className="lh-gc-id">{leave.id}</div>
          <div className="lh-gc-type" style={{ color: typeColor }}>{leave.type}</div>
        </div>
        <StatusBadge status={leave.status} />
      </div>

      <div className="lh-gc-body">
        <div className="lh-gc-row">
          <span className="lh-gc-key">From</span>
          <span className="lh-gc-val">{fmt(leave.from)}</span>
        </div>
        <div className="lh-gc-row">
          <span className="lh-gc-key">To</span>
          <span className="lh-gc-val">{fmt(leave.to)}</span>
        </div>
        <div className="lh-gc-row">
          <span className="lh-gc-key">Duration</span>
          <span className="lh-gc-val" style={{ color: typeColor }}>{leave.days} day{leave.days !== 1 ? "s" : ""}</span>
        </div>
        <div className="lh-gc-row">
          <span className="lh-gc-key">Applied</span>
          <span className="lh-gc-val">{fmt(leave.appliedOn)}</span>
        </div>
      </div>

      <div className="lh-gc-reason">"{leave.reason}"</div>
    </div>
  );
}

// ══════════════════════════════════════════
//  Main Component
// ══════════════════════════════════════════
export default function LeaveHistory() {
  const [mounted,    setMounted]    = useState(false);
  const [animated,   setAnimated]   = useState(false);
  const [year,       setYear]       = useState("2025");
  const [search,     setSearch]     = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [sortField,  setSortField]  = useState("from");
  const [sortDesc,   setSortDesc]   = useState(true);
  const [view,       setView]       = useState("table");   // "table" | "grid"
  const [page,       setPage]       = useState(1);
  const [toast,      setToast]      = useState("");

  useEffect(() => {
    const t1 = setTimeout(() => setMounted(true), 50);
    const t2 = setTimeout(() => setAnimated(true), 200);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, []);

  // reset page when filters change
  useEffect(() => setPage(1), [year, search, typeFilter, sortField, sortDesc]);

  // ── Filtered + sorted data ──
  const filtered = useMemo(() => {
    return MOCK_HISTORY
      .filter(l => l.id.startsWith(`LV-${year}`) || l.from.startsWith(year))
      .filter(l => typeFilter === "all" || l.type === typeFilter)
      .filter(l =>
        !search ||
        l.type.toLowerCase().includes(search.toLowerCase()) ||
        l.id.toLowerCase().includes(search.toLowerCase())   ||
        l.reason.toLowerCase().includes(search.toLowerCase())
      )
      .sort((a, b) => {
        const av = sortField === "days" ? a.days : new Date(a[sortField]);
        const bv = sortField === "days" ? b.days : new Date(b[sortField]);
        return sortDesc ? (bv > av ? 1 : -1) : (av > bv ? 1 : -1);
      });
  }, [year, search, typeFilter, sortField, sortDesc]);

  // ── Pagination ──
  const totalPages = Math.ceil(filtered.length / PER_PAGE);
  const paginated  = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  // ── Analytics ──
  const totalDays     = filtered.filter(l => l.status === "approved").reduce((s, l) => s + l.days, 0);
  const approvedCount = filtered.filter(l => l.status === "approved").length;
  const rejectedCount = filtered.filter(l => l.status === "rejected").length;
  const cancelCount   = filtered.filter(l => l.status === "cancelled").length;
  const mostUsedType  = useMemo(() => {
    const m = {};
    filtered.filter(l=>l.status==="approved").forEach(l => m[l.type] = (m[l.type]||0) + l.days);
    return Object.entries(m).sort((a,b)=>b[1]-a[1])[0]?.[0] || "—";
  }, [filtered]);

  // ── Donut data ──
  const donutData = useMemo(() => {
    const m = {};
    filtered.filter(l => l.status === "approved").forEach(l => m[l.type] = (m[l.type]||0) + l.days);
    return Object.entries(m)
      .map(([type, days]) => ({ type, days, color: TYPE_COLORS[type] || "#6b7280" }))
      .sort((a,b) => b.days - a.days);
  }, [filtered]);

  // ── Sort toggle ──
  const handleSort = (field) => {
    if (sortField === field) setSortDesc(v => !v);
    else { setSortField(field); setSortDesc(true); }
  };

  // ── Export CSV (mock) ──
  const handleExport = () => {
    const rows  = [["ID","Type","From","To","Days","Status","Reason","Applied On"]];
    filtered.forEach(l => rows.push([l.id, l.type, l.from, l.to, l.days, l.status, l.reason, l.appliedOn]));
    const csv   = rows.map(r => r.map(c => `"${c}"`).join(",")).join("\n");
    const blob  = new Blob([csv], { type: "text/csv" });
    const url   = URL.createObjectURL(blob);
    const a     = document.createElement("a");
    a.href      = url;
    a.download  = `leave-history-${year}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    setToast("CSV exported successfully!");
    setTimeout(() => setToast(""), 2800);
  };

  // ── Month-grouped (grid view) ──
  const grouped = useMemo(() => groupByMonth(paginated), [paginated]);

  const thProps = (field) => ({
    onClick: () => handleSort(field),
    style: { cursor:"pointer" },
  });
  const sortArrow = (field) =>
    sortField === field ? (sortDesc ? " ↓" : " ↑") : "";

  return (
    <div className={`lh-wrap${mounted ? " lh-mounted" : ""}`}>

      {/* ── Page Header ── */}
      <div className="lh-page-header">
        <div>
          <h2 className="lh-page-title">Leave History</h2>
          <p className="lh-page-sub">A complete record of all your past leave applications</p>
        </div>
        <button className="lh-export-btn" onClick={handleExport}>
          <DownloadIcon size={14} color="#fff" />
          Export CSV
        </button>
      </div>

      {/* ── Year Tabs ── */}
      <div className="lh-year-tabs">
        {YEARS.map(y => (
          <button
            key={y}
            className={`lh-year-tab${year === y ? " active" : ""}`}
            onClick={() => setYear(y)}
          >
            FY {y}–{String(Number(y)+1).slice(2)}
          </button>
        ))}
      </div>

      {/* ── Analytics Strip ── */}
      <div className="lh-analytics">
        <StatCard icon={CalIcon}   iconBg="#eff6ff" iconColor="#3b82f6" value={filtered.length} label="Total Requests" color="#1a1a1a"  sub={`FY ${year}`} />
        <StatCard icon={CheckIcon} iconBg="#ecfdf5" iconColor="#10b981" value={approvedCount}   label="Approved"       color="#10b981"  sub={`${totalDays} days taken`} />
        <StatCard icon={XIcon}     iconBg="#fef2f2" iconColor="#ef4444" value={rejectedCount}   label="Rejected"       color="#ef4444"  sub="Manager declined" />
        <StatCard icon={ClockIcon} iconBg="#f9fafb" iconColor="#6b7280" value={cancelCount}     label="Cancelled"      color="#6b7280"  sub="Self withdrawn" />
        <StatCard icon={SparkIcon} iconBg="#fef9ec" iconColor="#f59e0b" value={totalDays}       label="Days Taken"     color="#f59e0b"  sub={`Most: ${mostUsedType.split(" ")[0]}`} />
      </div>

      {/* ── Donut chart ── */}
      {donutData.length > 0 && (
        <DonutChart data={donutData} total={totalDays} animated={animated} />
      )}

      {/* ── Toolbar ── */}
      <div className="lh-toolbar">
        <div className="lh-filters">
          {/* Search */}
          <div className="lh-search-box">
            <SearchIcon size={14} color="#9ca3af" />
            <input
              className="lh-search-input"
              placeholder="Search ID, type, reason…"
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>

          {/* Type filter */}
          <select
            className="lh-select"
            value={typeFilter}
            onChange={e => setTypeFilter(e.target.value)}
          >
            <option value="all">All Types</option>
            {Object.keys(TYPE_COLORS).map(t => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>
        </div>

        {/* View toggle */}
        <div className="lh-view-btns">
          <button
            className={`lh-view-btn${view === "table" ? " active" : ""}`}
            onClick={() => setView("table")}
            title="Table view"
          >
            <ListIcon size={15} color={view === "table" ? "#fff" : "#6b7280"} />
          </button>
          <button
            className={`lh-view-btn${view === "grid" ? " active" : ""}`}
            onClick={() => setView("grid")}
            title="Grid view"
          >
            <GridIcon size={15} color={view === "grid" ? "#fff" : "#6b7280"} />
          </button>
        </div>
      </div>

      {/* ── Empty ── */}
      {filtered.length === 0 && (
        <div className="lh-empty">
          <div className="lh-empty-icon"><CalIcon size={26} color="#9ca3af" /></div>
          <p className="lh-empty-title">No leave history found</p>
          <p className="lh-empty-sub">Try changing the year or clearing your search filters.</p>
        </div>
      )}

      {/* ── TABLE VIEW ── */}
      {view === "table" && filtered.length > 0 && (
        <div className="lh-table-wrap">
          <table className="lh-table">
            <thead>
              <tr>
                <th><div className="lh-th-inner">ID</div></th>
                <th {...thProps("type")}><div className="lh-th-inner">Type{sortArrow("type")} <SortIcon size={10} color="#c4c4c4" /></div></th>
                <th {...thProps("from")}><div className="lh-th-inner">From{sortArrow("from")} <SortIcon size={10} color="#c4c4c4" /></div></th>
                <th {...thProps("to")}><div className="lh-th-inner">To{sortArrow("to")} <SortIcon size={10} color="#c4c4c4" /></div></th>
                <th {...thProps("days")}><div className="lh-th-inner">Days{sortArrow("days")} <SortIcon size={10} color="#c4c4c4" /></div></th>
                <th><div className="lh-th-inner">Status</div></th>
                <th><div className="lh-th-inner">Reason</div></th>
                <th {...thProps("appliedOn")}><div className="lh-th-inner">Applied{sortArrow("appliedOn")} <SortIcon size={10} color="#c4c4c4" /></div></th>
              </tr>
            </thead>
            <tbody>
              {paginated.map((l, i) => <TableRow key={l.id} leave={l} idx={i} />)}
            </tbody>
          </table>

          {/* Pagination */}
          <div className="lh-pagination">
            <span className="lh-page-info">
              Showing {Math.min((page-1)*PER_PAGE+1, filtered.length)}–{Math.min(page*PER_PAGE, filtered.length)} of {filtered.length}
            </span>
            <div className="lh-page-btns">
              <button className="lh-page-btn" onClick={() => setPage(p=>p-1)} disabled={page===1}>
                <ChevLeft size={12} color="#6b7280" />
              </button>
              {Array.from({ length: totalPages }, (_, i) => i+1).map(p => (
                <button
                  key={p}
                  className={`lh-page-btn${page===p?" active":""}`}
                  onClick={() => setPage(p)}
                >
                  {p}
                </button>
              ))}
              <button className="lh-page-btn" onClick={() => setPage(p=>p+1)} disabled={page===totalPages}>
                <ChevRight size={12} color="#6b7280" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── GRID VIEW ── */}
      {view === "grid" && filtered.length > 0 && (
        <>
          {Object.entries(grouped).map(([month, items]) => (
            <div key={month} className="lh-month-group">
              <div className="lh-month-label">
                <span>{month}</span>
                <div className="lh-month-line" />
                <span style={{ flexShrink:0 }}>{items.length} request{items.length!==1?"s":""}</span>
              </div>
              <div className="lh-grid">
                {items.map((l, i) => <GridCard key={l.id} leave={l} idx={i} />)}
              </div>
            </div>
          ))}

          {/* Grid pagination */}
          <div className="lh-pagination" style={{ background:"#fff", borderRadius:12, border:"1px solid #f0f0f0", marginTop:4 }}>
            <span className="lh-page-info">
              Showing {Math.min((page-1)*PER_PAGE+1, filtered.length)}–{Math.min(page*PER_PAGE, filtered.length)} of {filtered.length}
            </span>
            <div className="lh-page-btns">
              <button className="lh-page-btn" onClick={() => setPage(p=>p-1)} disabled={page===1}>
                <ChevLeft size={12} color="#6b7280" />
              </button>
              {Array.from({ length: totalPages }, (_, i) => i+1).map(p => (
                <button
                  key={p}
                  className={`lh-page-btn${page===p?" active":""}`}
                  onClick={() => setPage(p)}
                >
                  {p}
                </button>
              ))}
              <button className="lh-page-btn" onClick={() => setPage(p=>p+1)} disabled={page===totalPages}>
                <ChevRight size={12} color="#6b7280" />
              </button>
            </div>
          </div>
        </>
      )}

      {/* ── Toast ── */}
      {toast && (
        <div className="lh-toast">
          <CheckIcon size={14} color="#10b981" />
          {toast}
        </div>
      )}
    </div>
  );
}