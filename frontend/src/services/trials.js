import api from "./api";

export async function getTrials(filters = {}) {
  const params = {};

  if (filters.search) {
    params.search = filters.search;
  }

  if (filters.condition) {
    params.condition = filters.condition;
  }

  if (filters.phase) {
    params.phase = filters.phase;
  }

  if (filters.status) {
    params.status = filters.status;
  }

  if (filters.location) {
    params.location = filters.location;
  }

  const response = await api.get("/trials", {
    params,
  });

  return response.data;
}

export async function getTrial(trialId) {
  const response = await api.get(
    `/trials/${trialId}`
  );

  return response.data;
}
