import api from "../utils/axiosInstance";

const ENDPOINT = "/leaveTypes";

/**
 * Map API response → UI shape
 */
export function apiToUi(lt) {
  return {
    id:     lt.id,
    name:   lt.leaveTypeName,
    code:   lt.leaveCode,
    status: lt.status === "ACTIVE" ? "Active" : "Inactive",
  };
}

/**
 * Map UI form → API request body
 */
export function uiToApi(form) {
  return {
    leaveTypeName: form.name?.trim(),
    leaveCode:     form.code?.trim().toUpperCase(),
    status:        (form.status || "").toUpperCase(),
  };
}

/**
 * GET /leaveTypes?page=&size=&sortBy=&direction=
 */
export async function fetchAllLeaveTypes({
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
    leaveTypes:    raw.map(apiToUi),
    totalElements: res.data?.totalElements ?? raw.length,
    totalPages:    res.data?.totalPages    ?? 1,
  };
}

/**
 * GET /leaveTypes/:id
 */
export async function fetchLeaveTypeById(id) {
  const res = await api.get(`${ENDPOINT}/${id}`);
  return apiToUi(res.data);
}

/**
 * POST /leaveTypes
 */
export async function createLeaveType(form) {
  const res = await api.post(ENDPOINT, uiToApi(form));
  return apiToUi(res.data);
}

/**
 * PUT /leaveTypes/:id
 */
export async function updateLeaveType(id, form) {
  const res = await api.put(`${ENDPOINT}/${id}`, uiToApi(form));
  return apiToUi(res.data);
}

/**
 * DELETE /leaveTypes/:id
 */
export async function deleteLeaveType(id) {
  await api.delete(`${ENDPOINT}/${id}`);
}