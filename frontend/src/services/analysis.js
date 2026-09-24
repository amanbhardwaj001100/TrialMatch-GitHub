import api from "./api";

export async function analyzeReport(reportId) {
  const response = await api.post(
    `/analysis/${reportId}`
  );

  return response.data;
}
