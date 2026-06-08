import api from "../utils/axiosInstance";

const ENDPOINT = "/leavePolicy";

export function apiToUi(policy) {
  return {
    id: policy.id,
    name: policy.policyName,
    status: policy.status === "ACTIVE"
      ? "Active"
      : "Inactive",

    allocations: (policy.leaveConfigurations || []).map(config => ({
      leaveTypeId: config.leaveTypeId,
      leaveTypeName: config.leaveTypeName,
      leaveTypeCode: config.leaveCode,
      days: config.allocatedDays,
    })),
  };
}

export function uiToApi(form) {
  return {
    policyName: form.name?.trim(),

    status:
      form.status === "Active"
        ? "ACTIVE"
        : "INACTIVE",

    leaveConfigurations:
      form.allocations?.map(item => ({
        leaveTypeId: Number(item.leaveTypeId),
        allocatedDays: Number(item.days),
      })) || [],
  };
}

export async function fetchAllPolicies({
  page = 0,
  size = 100,
  sortBy = "createdAt",
  direction = "desc",
} = {}) {

  const res = await api.get(ENDPOINT, {
    params: {
      page,
      size,
      sortBy,
      direction,
    },
  });

  const content = res.data?.content || [];

  return {
    policies: content.map(apiToUi),
    totalElements: res.data?.totalElements || 0,
    totalPages: res.data?.totalPages || 0,
  };
}

export async function fetchPolicyById(id) {
  const res = await api.get(`${ENDPOINT}/${id}`);
  return apiToUi(res.data);
}

export async function createPolicy(form) {
  const res = await api.post(
    ENDPOINT,
    uiToApi(form)
  );

  return apiToUi(res.data);
}

export async function updatePolicy(id, form) {
  const res = await api.put(
    `${ENDPOINT}/${id}`,
    uiToApi(form)
  );

  return apiToUi(res.data);
}

export async function deletePolicy(id) {
  await api.delete(`${ENDPOINT}/${id}`);
}