import axios from "axios";
// .env VITE_APP_API_URL=http://127.0.0.1:8000
const api = axios.create({
  baseURL: `${import.meta.env.VITE_APP_API_URL}/api`,
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    // Get token from localStorage
    const token = localStorage.getItem("token");

    // If token exists, add to headers
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }

    // ⚠️ Bắt buộc khi dùng ngrok Free
    config.headers["ngrok-skip-browser-warning"] = "true";

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;
