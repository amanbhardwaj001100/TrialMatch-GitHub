import api from "./api";

export async function getMatches(patientId) {
  return (
    await api.get(`/matches/${patientId}`)
  ).data;
}

export async function runMatching(patientId) {
  return (
    await api.post(`/matches/${patientId}/run`)
  ).data;
}
