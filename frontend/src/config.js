// src/config.js
const API_BASE_URL =
  window.location.hostname === "localhost"
    ? "http://localhost:3006"
    : "http://13.233.192.180";

export default API_BASE_URL;
