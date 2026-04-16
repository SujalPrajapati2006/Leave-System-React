import { useState, useEffect, useRef } from "react";
import "./NotificationBell.css";

// ── Sample notifications (replace with API data) ──
const SAMPLE_NOTIFICATIONS = [
  {
    id: 1,
    type: "approved",
    title: "Leave Request Approved",
    message: "Your annual leave for Dec 24–26 has been approved.",
    time: "2 min ago",
    read: false,
  },
  {
    id: 2,
    type: "pending",
    title: "Approval Pending",
    message: "Your sick leave request is awaiting manager review.",
    time: "1 hr ago",
    read: false,
  },
  {
    id: 3,
    type: "rejected",
    title: "Leave Request Rejected",
    message: "Your casual leave on Jan 3 was rejected. See remarks.",
    time: "3 hrs ago",
    read: false,
  },
  {
    id: 4,
    type: "info",
    title: "Policy Update",
    message: "Carry-forward leave policy updated for FY 2025–26.",
    time: "Yesterday",
    read: true,
  },
  {
    id: 5,
    type: "approved",
    title: "Comp-Off Credited",
    message: "1 comp-off day credited for working on Dec 15.",
    time: "2 days ago",
    read: true,
  },
];

// ── Icons ──
const BellIcon = ({ size = 16, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
    stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9" />
    <path d="M13.73 21a2 2 0 01-3.46 0" />
  </svg>
);

const CheckIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

const ClockIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" />
    <polyline points="12 6 12 12 16 14" />
  </svg>
);

const XIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);

const InfoIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" />
    <line x1="12" y1="8" x2="12" y2="8.01" strokeWidth="3" />
    <line x1="12" y1="12" x2="12" y2="16" />
  </svg>
);

const ICON_MAP = {
  approved: CheckIcon,
  pending:  ClockIcon,
  rejected: XIcon,
  info:     InfoIcon,
};

export default function NotificationBell() {
  const [open, setOpen]                   = useState(false);
  const [notifications, setNotifications] = useState(SAMPLE_NOTIFICATIONS);
  const ref = useRef(null);

  const unreadCount = notifications.filter(n => !n.read).length;

  // Close on outside click
  useEffect(() => {
    const handler = e => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // Close on Escape
  useEffect(() => {
    const handler = e => { if (e.key === "Escape") setOpen(false); };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, []);

  const markAllRead = () => setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  const markRead    = id => setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  const dismiss     = (e, id) => { e.stopPropagation(); setNotifications(prev => prev.filter(n => n.id !== id)); };

  return (
    <div className="nb-root" ref={ref}>
      {/* Bell Button */}
      <button
        className={`nb-trigger icon-btn${open ? " nb-trigger--open" : ""}`}
        onClick={() => setOpen(v => !v)}
        aria-label={`Notifications${unreadCount > 0 ? `, ${unreadCount} unread` : ""}`}
        aria-expanded={open}
        aria-haspopup="true"
      >
        <BellIcon size={16} color={open ? "var(--dash-text, #1a1916)" : "currentColor"} />
        {unreadCount > 0 && (
          <span className="nb-badge" aria-hidden="true">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown Panel */}
      {open && (
        <div className="nb-panel" role="dialog" aria-label="Notifications">
          {/* Header */}
          <div className="nb-header">
            <div className="nb-header-left">
              <span className="nb-header-title">Notifications</span>
              {unreadCount > 0 && (
                <span className="nb-unread-pill">{unreadCount} new</span>
              )}
            </div>
            {unreadCount > 0 && (
              <button className="nb-mark-all" onClick={markAllRead}>Mark all read</button>
            )}
          </div>

          {/* List */}
          <ul className="nb-list" role="list">
            {notifications.length === 0 ? (
              <li className="nb-empty">
                <span className="nb-empty-icon"><BellIcon size={24} color="#4b5563" /></span>
                <span>You're all caught up!</span>
              </li>
            ) : (
              notifications.map((n, i) => {
                const TypeIcon = ICON_MAP[n.type] || InfoIcon;
                return (
                  <li
                    key={n.id}
                    className={`nb-item${n.read ? " nb-item--read" : ""}`}
                    style={{ animationDelay: `${i * 40}ms` }}
                    onClick={() => markRead(n.id)}
                    role="listitem"
                  >
                    <span className={`nb-type-icon nb-type-icon--${n.type}`}><TypeIcon /></span>
                    <div className="nb-item-body">
                      <span className="nb-item-title">{n.title}</span>
                      <span className="nb-item-msg">{n.message}</span>
                      <span className="nb-item-time">{n.time}</span>
                    </div>
                    <div className="nb-item-end">
                      {!n.read && <span className="nb-dot" aria-label="Unread" />}
                      <button className="nb-dismiss" onClick={e => dismiss(e, n.id)} aria-label="Dismiss notification">
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none"
                          stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                          <line x1="18" y1="6" x2="6" y2="18" />
                          <line x1="6" y1="6" x2="18" y2="18" />
                        </svg>
                      </button>
                    </div>
                  </li>
                );
              })
            )}
          </ul>

          {/* Footer */}
          {notifications.length > 0 && (
            <div className="nb-footer">
              <button className="nb-view-all">
                View all notifications
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none"
                  stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="5" y1="12" x2="19" y2="12" />
                  <polyline points="12 5 19 12 12 19" />
                </svg>
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}