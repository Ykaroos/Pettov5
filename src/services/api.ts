import axios from "axios";

const api = axios.create({
  baseURL: "https://petto-api.onrender.com",
  timeout: 5000,
});

export default api;