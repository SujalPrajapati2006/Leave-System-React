import React, { useState } from "react";
import "./EmployeeManagement.css";

export default function EmployeeManagement() {
  const [formData, setFormData] = useState({
    fullName: "",
    officialEmail: "",
    dateOfJoining: "",
    Department: "",
    Designation: "",
    leavePolicy: "Corporate 2025",
    annualSickLeave: 0,
    annualCasualLeave: 0,
    earnedLeaveAccrualRate: "",
    password: "",
    role: "Employee",
    requirePasswordChange: false,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert("Employee profile created!");
  };

  return (
    <div className="em-main">
      {/* Header */}
      <header className="em-header">
        <div>
          <h1 className="em-page-title">Add New Employee</h1>
          <p className="em-page-sub">Enter details to onboard a new employee and configure leave</p>
        </div>
        <div className="em-header-actions">
          <button className="em-icon-btn">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>
          </button>
          <button className="em-icon-btn">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
          </button>
          <button className="em-icon-btn">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="1"/><circle cx="19" cy="12" r="1"/><circle cx="5" cy="12" r="1"/></svg>
          </button>
        </div>
      </header>

      {/* Form Card */}
      <div className="em-card">
        {/* Admin Info Row */}
        <div className="em-admin-row">
          <div className="em-admin-info">
            <div className="em-avatar">A</div>
            <div>
              <div className="em-admin-name">Admin</div>
              <div className="em-admin-id">hx170000</div>
              <span className="em-badge-admin">ADMIN</span>
            </div>
          </div>
          <div className="em-fy-badge">FY 2025–26</div>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Step 1 */}
          <div className="em-step-title">Step 1: Personal Details</div>
          <div className="em-form-grid em-grid-5">
            <div className="em-field">
              <label className="em-label">Full Name</label>
              <div className="em-input-wrap">
                <svg className="em-input-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                <input className="em-input" type="text" name="fullName" placeholder="Full Name" value={formData.fullName} onChange={handleChange} />
              </div>
            </div>
            <div className="em-field">
              <label className="em-label">Official Email</label>
              <div className="em-input-wrap">
                <svg className="em-input-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="m2 7 10 7 10-7"/></svg>
                <input className="em-input" type="email" name="officialEmail" placeholder="Official Email" value={formData.officialEmail} onChange={handleChange} />
              </div>
            </div>
            <div className="em-field">
              <label className="em-label">Date of Joining</label>
              <div className="em-input-wrap">
                <input className="em-input" type="date" name="dateOfJoining" value={formData.dateOfJoining} onChange={handleChange} />
              </div>
            </div>
            <div className="em-field">
              <label className="em-label">Department</label>
              <div className="em-input-wrap">
                <input className="em-input" type="text" name="Department" placeholder="Department" value={formData.jobTitle} onChange={handleChange} />
              </div>
            </div>

            <div className="em-field">
                <label className="em-label">Designation</label>
                <div className="em-input-wrap">
                    <input className="em-input" type="text" name="Designation" placeholder="Designation" value={formData.jobTitle} onChange={handleChange} />
                </div>
              </div>
          </div>

          {/* Step 2 */}
          <div className="em-step-title">Step 2: Leave Policy &amp; Allocation</div>
          <div className="em-form-grid em-grid-4">
            <div className="em-field">
              <label className="em-label">Leave Policy Dropdown</label>
              <div className="em-select-wrap">
                <svg className="em-select-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="3"/><path d="M12 1v4M12 19v4M4.22 4.22l2.83 2.83M16.95 16.95l2.83 2.83M1 12h4M19 12h4M4.22 19.78l2.83-2.83M16.95 7.05l2.83-2.83"/></svg>
                <select className="em-select" name="leavePolicy" value={formData.leavePolicy} onChange={handleChange}>
                  <option>Corporate 2025</option>
                  <option>Corporate 2024</option>
                  <option>Startup Policy</option>
                </select>
              </div>
            </div>
            <div className="em-field">
              <label className="em-label">Annual Sick Leave</label>
              <div className="em-input-wrap em-spinner-wrap">
                <input className="em-input" type="number" name="annualSickLeave" value={formData.annualSickLeave} onChange={handleChange} min={0} />
                <div className="em-spinners">
                  <button type="button" className="em-spin-btn" onClick={() => setFormData(p => ({ ...p, annualSickLeave: p.annualSickLeave + 1 }))}>▲</button>
                  <button type="button" className="em-spin-btn" onClick={() => setFormData(p => ({ ...p, annualSickLeave: Math.max(0, p.annualSickLeave - 1) }))}>▼</button>
                </div>
              </div>
            </div>
            <div className="em-field">
              <label className="em-label">Annual Casual Leave</label>
              <div className="em-input-wrap em-spinner-wrap">
                <input className="em-input" type="number" name="annualCasualLeave" value={formData.annualCasualLeave} onChange={handleChange} min={0} />
                <div className="em-spinners">
                  <button type="button" className="em-spin-btn" onClick={() => setFormData(p => ({ ...p, annualCasualLeave: p.annualCasualLeave + 1 }))}>▲</button>
                  <button type="button" className="em-spin-btn" onClick={() => setFormData(p => ({ ...p, annualCasualLeave: Math.max(0, p.annualCasualLeave - 1) }))}>▼</button>
                </div>
              </div>
            </div>
            <div className="em-field">
              <label className="em-label">Earned Leave Accrual Rate</label>
              <div className="em-input-wrap">
                <input className="em-input" type="text" name="earnedLeaveAccrualRate" placeholder="Annual Accrual Rate" value={formData.earnedLeaveAccrualRate} onChange={handleChange} />
              </div>
            </div>
          </div>

          {/* Step 3 */}
          <div className="em-step-title">Step 3: Security &amp; Access</div>
          <div className="em-form-grid em-grid-3-access">
            <div className="em-field">
              <label className="em-label">Set Initial Password</label>
              <div className="em-input-wrap">
                <input className="em-input" type="password" name="password" placeholder="Set Initial Password" value={formData.password} onChange={handleChange} />
              </div>
            </div>
            <div className="em-field">
              <label className="em-label">Select Role Dropdown</label>
              <div className="em-select-wrap">
                <select className="em-select" name="role" value={formData.role} onChange={handleChange}>
                  <option>Employee</option>
                  <option>Manager</option>
                  <option>Admin</option>
                  <option>HR</option>
                </select>
              </div>
            </div>
            <div className="em-field em-checkbox-field">
              <label className="em-checkbox-label">
                <input type="checkbox" name="requirePasswordChange" checked={formData.requirePasswordChange} onChange={handleChange} className="em-checkbox" />
                Require password change on first login
              </label>
            </div>
          </div>

          {/* Submit */}
          <div className="em-submit-row">
            <button type="submit" className="em-submit-btn">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
              Create Employee Profile
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}