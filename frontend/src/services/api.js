import axios from "axios";

const api = axios.create({
  baseURL:
    import.meta.env.VITE_API_BASE_URL ||
    "http://localhost:8000/api",

  timeout: 15000,
});


api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("trialmatch_token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);


api.interceptors.response.use(
  (response) => response,

  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("trialmatch_token");
      localStorage.removeItem("trialmatch_user");
    }

    return Promise.reject(error);
  }
);


export default api;
