import api from "../utils/axiosInstance";

const DEPT_ENDPOINT = "/departments";

export function deptApiToUi(d) {
  return {
    id: d.id,
    name: d.departmentName,
    code: d.departmentCode,
    leavePolicyId: d.leavePolicyId ?? null,
    leavePolicy: d.leavePolicyName ?? (d.leavePolicyId ? `Policy ID: ${d.leavePolicyId}` : "—"),
    status: d.status === "ACTIVE" ? "Active" : "INACTIVE",
  };
}

export function deptUiToApi(form, rawPolicies = []) {
  const matchedPolicy = rawPolicies.find(p => p.name === form.leavePolicy);

  return {
    departmentName: form.name?.trim(),
    departmentCode: form.code?.trim()?.toUpperCase(),
    leavePolicyId: matchedPolicy ? matchedPolicy.id : (Number(form.leavePolicyId) || null),
    status: (form.status || "").toUpperCase(),
  };
}

export async function fetchAllDepartments({
  page = 0,
  size = 100,
  sortBy = "createdAt",
  direction = "desc",
} = {}) {

  const res = await api.get(DEPT_ENDPOINT, {
    params: { page, size, sortBy, direction },
  });

  const raw = Array.isArray(res.data)
    ? res.data
    : (res.data?.content ?? []);

  return raw.map(deptApiToUi);
}

export async function createDepartment(form, rawPolicies) {
  const res = await api.post(DEPT_ENDPOINT, deptUiToApi(form, rawPolicies));
  return deptApiToUi(res.data);
}

export async function updateDepartment(id, form, rawPolicies) {
  const res = await api.put(`${DEPT_ENDPOINT}/${id}`, deptUiToApi(form, rawPolicies));
  return deptApiToUi(res.data);
}

export async function deleteDepartment(id) {
  await api.delete(`${DEPT_ENDPOINT}/${id}`);
}