import api from "./api";

export async function getPatients() {
  const response = await api.get("/patients");
  return response.data;
}

export async function getPatient(patientId) {
  const response = await api.get(`/patients/${patientId}`);
  return response.data;
}

export async function createPatient(patient) {
  const response = await api.post("/patients", patient);
  return response.data;
}
