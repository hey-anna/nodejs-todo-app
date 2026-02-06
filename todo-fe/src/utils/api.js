import axios from "axios";

/**
 * Axios instance (Vite)
 * - .env: VITE_BACKEND_URL=http://localhost:5050
 * - baseURL: `${VITE_BACKEND_URL}/api`
 */
const api = axios.create({
  baseURL: `${import.meta.env.VITE_BACKEND_URL}/api`,
  headers: {
    "Content-Type": "application/json",
  },
});
/**
 * Log all requests
 */
api.interceptors.request.use(
  (request) => {
    console.log("Starting Request", request);
    return request;
  },
  (error) => {
    console.log("REQUEST ERROR", error);
    return Promise.reject(error);
  },
);
/**
 * Log all responses + normalize errors
 * - If server responds: reject with `error.response.data` (server payload)
 * - If no response (network/CORS): reject with original error
 */
api.interceptors.response.use(
  (response) => {
    console.log("Response:", response);
    return response;
  },
  (error) => {
    const payload = error?.response?.data ?? error;
    console.log("RESPONSE ERROR", payload);
    return Promise.reject(payload);
  },
);
export default api;
