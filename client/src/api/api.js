import axios from "axios";

const baseURL =
  process.env.NODE_ENV === "development"
    ? "http://localhost:5000" // Local backend for development
    : process.env.REACT_APP_API_URL; // Deployed backend URL for production

// Create an Axios instance
const api = axios.create({
  baseURL,
  withCredentials: true,
});

export default api;
