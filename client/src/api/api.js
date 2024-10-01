import axios from "axios";

// Create an Axios instance with the URL of the backend API
const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
});

export default api;
