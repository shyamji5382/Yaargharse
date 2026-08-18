import api from "./api";

export const register = (data) => api.post("/register", data).then(r => r.data);
export const login = (data) => api.post("/login", data).then(r => r.data);
export const getMe = () => api.get("/me").then(r => r.data);
