import axios from "axios";

const api = axios.create({
  baseURL: "https://api.coingecko.com/api/v3",
  timeout: 10000, // 10 seconds timeout
});

// Response interceptor for global error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.code === 'ECONNABORTED') {
      console.error('Request timed out');
    } else if (!error.response) {
      console.error('Network error - please check your internet connection');
    } else {
      console.error(`API error: ${error.response.status} - ${error.response.statusText}`);
    }
    return Promise.reject(error);
  }
);

export default api;
