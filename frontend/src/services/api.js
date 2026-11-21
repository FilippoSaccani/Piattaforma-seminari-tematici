import axios from "axios";

// In sviluppo Vite inoltra le chiamate a /api al backend Flask
const api = axios.create({
    baseURL: "/api"
});

export default api;
