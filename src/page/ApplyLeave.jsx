import { useState } from "react";
import "./ApplyLeave.css";

const LEAVE_TYPES = [
  { id: "casual", label: "Casual Leave", color: "#3b82f6", remaining: 6 },
  { id: "sick", label: "Sick Leave", color: "#f59e0b", remaining: 4 },
  { id: "earned", label: "Earned Leave", color: "#10b981", remaining: 12 },
  { id: "comp", label: "Comp Off", color: "#ec4899", remaining: 2 },
];

export default function ApplyLeave() {
  const [form, setForm] = useState({
    leaveType: "",
    fromDate: "",
    toDate: "",
    reason: "",
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleChange = (field, value) => {
    setForm({ ...form, [field]: value });
  };

  const validate = () => {
    const e = {};
    if (!form.leaveType) e.leaveType = "Select leave type";
    if (!form.fromDate) e.fromDate = "Select start date";
    if (!form.toDate) e.toDate = "Select end date";
    if (!form.reason) e.reason = "Enter reason";
    return e;
  };

  const handleSubmit = async () => {
    const e = validate();
    if (Object.keys(e).length) {
      setErrors(e);
      return;
    }

    setLoading(true);

    setTimeout(() => {
      setLoading(false);
      alert("Leave Applied Successfully");
    }, 1000);
  };

  return (
    <div className="apply-leave-container">
      <div className="apply-header">
        <h2>Apply Leave</h2>
        <p>Submit your leave request</p>
      </div>

      <div className="apply-card">
        {/* Leave Type */}
        <div className="form-group">
          <label>Leave Type</label>

          <div className="leave-types">
            {LEAVE_TYPES.map((type) => (
              <button
                key={type.id}
                className={`leave-type ${
                  form.leaveType === type.id ? "active" : ""
                }`}
                onClick={() => handleChange("leaveType", type.id)}
              >
                <span>{type.label}</span>
                <small>{type.remaining} days left</small>
              </button>
            ))}
          </div>

          {errors.leaveType && (
            <p className="error">{errors.leaveType}</p>
          )}
        </div>

        {/* Date */}
        <div className="date-row">
          <div className="form-group">
            <label>From</label>
            <input
              type="date"
              onChange={(e) =>
                handleChange("fromDate", e.target.value)
              }
            />
            {errors.fromDate && (
              <p className="error">{errors.fromDate}</p>
            )}
          </div>

          <div className="form-group">
            <label>To</label>
            <input
              type="date"
              onChange={(e) =>
                handleChange("toDate", e.target.value)
              }
            />
            {errors.toDate && (
              <p className="error">{errors.toDate}</p>
            )}
          </div>
        </div>

        {/* Reason */}
        <div className="form-group">
          <label>Reason</label>
          <textarea
            rows="4"
            placeholder="Reason for leave..."
            onChange={(e) =>
              handleChange("reason", e.target.value)
            }
          />
          {errors.reason && (
            <p className="error">{errors.reason}</p>
          )}
        </div>

        <button
          className="submit-btn"
          onClick={handleSubmit}
          disabled={loading}
        >
          {loading ? "Submitting..." : "Apply Leave"}
        </button>
      </div>
    </div>
  );
}