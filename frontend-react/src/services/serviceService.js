import api from "./api";

export const getServices = () => api.get("/services").then(r => r.data);
export const getMyServices = () => api.get("/services/mine").then(r => r.data);
export const createService = (formData) =>
  api.post("/services", formData, { headers: { "Content-Type": "multipart/form-data" } }).then(r => r.data);
export const updateServiceAvailability = (id, available) =>
  api.patch(`/services/${id}/availability`, { available }).then(r => r.data);
export const deleteService = (id) => api.delete(`/services/${id}`).then(r => r.data);
