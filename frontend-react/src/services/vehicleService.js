import api from "./api";

export const getVehicles = () => api.get("/vehicles").then(r => r.data);
export const getMyVehicles = () => api.get("/vehicles/mine").then(r => r.data);

export const createVehicle = (formData) =>
  api.post("/vehicles", formData, {
    headers: { "Content-Type": "multipart/form-data" }
  }).then(r => r.data);

export const updateAvailability = (id, available) =>
  api.patch(`/vehicles/${id}/availability`, { available }).then(r => r.data);

export const deleteVehicle = (id) => api.delete(`/vehicles/${id}`).then(r => r.data);
