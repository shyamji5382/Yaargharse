import api from "./api";

export const getLibraries = () => api.get("/libraries").then(r => r.data);
export const getMyLibraries = () => api.get("/libraries/mine").then(r => r.data);
export const createLibrary = (formData) =>
  api.post("/libraries", formData, { headers: { "Content-Type": "multipart/form-data" } }).then(r => r.data);
export const updateLibraryAvailability = (id, available) =>
  api.patch(`/libraries/${id}/availability`, { available }).then(r => r.data);
export const deleteLibrary = (id) => api.delete(`/libraries/${id}`).then(r => r.data);
