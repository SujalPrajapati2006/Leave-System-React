import api from "../utils/axiosInstance";

const ENDPOINT = "/employmentTypes";

/**
 * Map API response → UI shape
 */
export function apiToUi(et) {
  return {
    id:     et.id,
    name:   et.employmentTypeName,
    status: et.status === "ACTIVE" ? "Active" : "INACTIVE",
  };
}

/**
 * Map UI form → API request body
 */
export function uiToApi(form) {
  return {
    employmentTypeName: form.name?.trim(),
    status:             (form.status || "").toUpperCase(),
  };
}

/**
 * GET /employmentTypes?page=&size=&sortBy=&direction=
 */
export async function fetchAllEmploymentTypes({
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
    employmentTypes: raw.map(apiToUi),
    totalElements:   res.data?.totalElements ?? raw.length,
    totalPages:      res.data?.totalPages    ?? 1,
  };
}

/**
 * GET /employmentTypes/:id
 */
export async function fetchEmploymentTypeById(id) {
  const res = await api.get(`${ENDPOINT}/${id}`);
  return apiToUi(res.data);
}

/**
 * POST /employmentTypes
 */
export async function createEmploymentType(form) {
  const res = await api.post(ENDPOINT, uiToApi(form));
  return apiToUi(res.data);
}

/**
 * PUT /employmentTypes/:id
 */
export async function updateEmploymentType(id, form) {
  const res = await api.put(`${ENDPOINT}/${id}`, uiToApi(form));
  return apiToUi(res.data);
}

/**
 * DELETE /employmentTypes/:id
 */
export async function deleteEmploymentType(id) {
  await api.delete(`${ENDPOINT}/${id}`);
}