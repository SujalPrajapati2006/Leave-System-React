import api from "../utils/axiosInstance";

const ENDPOINT = "/employees";

export function apiToUi(emp) {
  return {
    id:                 emp.id,
    employeeId:         emp.employeeId,
    fullName:           emp.fullName,
    email:              emp.email,
    phoneNumber:        emp.phoneNumber,
    joiningDate:        emp.joiningDate,
    employmentTypeId:   emp.employmentTypeId,
    employmentTypeName: emp.employmentTypeName,
    designationId:      emp.designationId,
    designationName:    emp.designationName,
    departmentId:       emp.departmentId,
    departmentName:     emp.departmentName,
    // ── changed: full object instead of just id ──
    leavePolicy: emp.leavePolicy
      ? {
          id:                 emp.leavePolicy.id,
          policyName:         emp.leavePolicy.policyName,
          status:             emp.leavePolicy.status,
          leaveConfigurations: (emp.leavePolicy.leaveConfigurations ?? []).map((c) => ({
            id:            c.id,
            leaveTypeId:   c.leaveTypeId,
            leaveTypeName: c.leaveTypeName,
            leaveCode:     c.leaveCode,
            allocatedDays: c.allocatedDays,
          })),
        }
      : null,
    profilePicture: emp.profilePicture,
  };
}

export function uiToApi(form) {
  return {
    fullName:          form.fullName?.trim(),
    email:             form.officialEmail?.trim().toLowerCase(),
    phoneNumber:       form.phoneNumber?.trim(),
    joiningDate:       form.dateOfJoining,           // "YYYY-MM-DD"
    employmentTypeId:  Number(form.employmentType),
    designationId:     Number(form.designation),
    profilePicture:    form.profilePicture ?? null,
  };
}

export async function createEmployee(form, profilePicFile) {
  const formData = new FormData();

  formData.append("fullName",         form.fullName?.trim());
  formData.append("email",            form.officialEmail?.trim().toLowerCase());
  formData.append("phoneNumber",      form.phoneNumber?.trim());
  formData.append("joiningDate",      form.dateOfJoining);
  formData.append("employmentTypeId", Number(form.employmentType));
  formData.append("designationId",    Number(form.designation));

  if (profilePicFile) {
    formData.append("profilePicture", profilePicFile);
  }

  const res = await api.post("/employees", formData, {
    headers: {
      "Content-Type": undefined,  // let browser set multipart boundary
    },
  });

  return apiToUi(res.data);
}
/**
 * GET /employees?page=&size=&sortBy=&direction=
 */
export async function fetchAllEmployees({
  page      = 0,
  size      = 100,
  sortBy    = "createdAt",
  direction = "desc",
} = {}) {
  const res = await api.get(ENDPOINT, {
    params: { page, size, sortBy, direction },
  });

  const raw = Array.isArray(res.data)
    ? res.data
    : (res.data?.content ?? []);

  return {
    employees:     raw.map(apiToUi),
    totalElements: res.data?.totalElements ?? raw.length,
    totalPages:    res.data?.totalPages    ?? 1,
  };
}

/**
 * GET /employees/:id
 */
export async function fetchEmployeeById(id) {
  const res = await api.get(`${ENDPOINT}/${id}`);
  return apiToUi(res.data);
}

/**
 * PUT /employees/:id
 */
export async function updateEmployee(id, form) {
  const res = await api.put(`${ENDPOINT}/${id}`, uiToApi(form));
  return apiToUi(res.data);
}

/**
 * DELETE /employees/:id
 */
export async function deleteEmployee(id) {
  await api.delete(`${ENDPOINT}/${id}`);
}