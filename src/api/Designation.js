import api from "../utils/axiosInstance";

const DESIGNATION_ENDPOINT = "/designations";

export function designationApiToUi(d) {
  return {
    id: d.id,
    name: d.designationName,
    departmentId: d.departmentId ?? null,
    department: d.departmentName ?? "—",
    status: d.status === "ACTIVE" ? "Active" : "INACTIVE",
  };
}

export function designationUiToApi(form, rawDepartments = []) {
  const matchedDepartment = rawDepartments.find(
    d => d.name === form.department
  );

  return {
    designationName: form.name?.trim(),
    departmentId: matchedDepartment
      ? matchedDepartment.id
      : (Number(form.departmentId) || null),
    status: (form.status || "").toUpperCase(),
  };
}

export async function fetchAllDesignations({
  page = 0,
  size = 100,
  sortBy = "createdAt",
  direction = "desc",
} = {}) {

  const res = await api.get(DESIGNATION_ENDPOINT, {
    params: { page, size, sortBy, direction },
  });

  const raw = Array.isArray(res.data)
    ? res.data
    : (res.data?.content ?? []);

  return raw.map(designationApiToUi);
}

export async function fetchDesignationById(id) {
  const res = await api.get(`${DESIGNATION_ENDPOINT}/${id}`);
  return designationApiToUi(res.data);
}

export async function createDesignation(form, rawDepartments) {
  const res = await api.post(
    DESIGNATION_ENDPOINT,
    designationUiToApi(form, rawDepartments)
  );

  return designationApiToUi(res.data);
}

export async function updateDesignation(id, form, rawDepartments) {
  const res = await api.put(
    `${DESIGNATION_ENDPOINT}/${id}`,
    designationUiToApi(form, rawDepartments)
  );

  return designationApiToUi(res.data);
}

export async function deleteDesignation(id) {
  await api.delete(`${DESIGNATION_ENDPOINT}/${id}`);
}