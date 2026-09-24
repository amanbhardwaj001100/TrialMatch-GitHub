import api from "./api";

export async function getReports(patientId = null) {
  const params = {};

  if (patientId) {
    params.patient_id = patientId;
  }

  const response = await api.get("/reports", {
    params,
  });

  return response.data;
}

export async function getReport(reportId) {
  const response = await api.get(`/reports/${reportId}`);
  return response.data;
}

export async function uploadReport({
  patientId,
  reportType,
  file,
}) {
  const formData = new FormData();

  formData.append("file", file);

  const response = await api.post(
    `/reports/upload?patient_id=${encodeURIComponent(
      patientId
    )}&report_type=${encodeURIComponent(
      reportType || "Medical Report"
    )}`,
    formData
  );

  return response.data;
}
