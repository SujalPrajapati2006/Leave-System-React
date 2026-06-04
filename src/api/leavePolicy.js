import api from "../utils/axiosInstance";

const ENDPOINT = "/leavePolicy";

export function apiToUi(p) {
  return {
    id:          p.id,
    name:        p.policyName,
    compOff:     p.compOffDays     ?? 0,
    sickLeave:   p.sickLeaveDays   ?? 0,
    casualLeave: p.casualLeaveDays ?? 0,
    earnedLeave: p.earnedLeaveDays ?? 0,
    status:      p.status === "ACTIVE" ? "Active" : "Inactive",
    createdAt:   p.createdAt ?? null,
    updatedAt:   p.updatedAt ?? null,
  };
}

export function uiToApi(form) {
  return {
    policyName:      form.policyName?.trim(),
    compOffDays:     Number(form.compOffDays)     || 0,
    sickLeaveDays:   Number(form.sickLeaveDays)   || 0,
    casualLeaveDays: Number(form.casualLeaveDays) || 0,
    earnedLeaveDays: Number(form.earnedLeaveDays) || 0,
    status:          (form.status || "").toUpperCase(),
  };
}

export async function fetchAllPolicies({
  page      = 0,
  size      = 100,
  sortBy    = "createdAt",
  direction = "desc",
} = {}) {
  const res = await api.get(ENDPOINT, {
    params: { page, size, sortBy, direction },
  });

  const raw = Array.isArray(res.data) ? res.data : (res.data?.content ?? []);
  return {
    policies:      raw.map(apiToUi),
    totalElements: res.data?.totalElements ?? raw.length,
    totalPages:    res.data?.totalPages    ?? 1,
  };
}

export async function createPolicy(form) {
  const res = await api.post(ENDPOINT, uiToApi(form));
  return apiToUi(res.data);
}

export async function updatePolicy(id, form) {
  const res = await api.put(`${ENDPOINT}/${id}`, uiToApi(form));
  return apiToUi(res.data);
}

export async function deletePolicy(id) {
  await api.delete(`${ENDPOINT}/${id}`);
}