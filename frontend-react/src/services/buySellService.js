import api from "./api";

export const getItems = () => api.get("/buysell").then(r => r.data);
export const getMyItems = () => api.get("/buysell/mine").then(r => r.data);

export const createItem = (formData) =>
  api.post("/buysell", formData, {
    headers: { "Content-Type": "multipart/form-data" }
  }).then(r => r.data);

export const markSold = (id, sold) => api.patch(`/buysell/${id}/sold`, { sold }).then(r => r.data);
export const deleteItem = (id) => api.delete(`/buysell/${id}`).then(r => r.data);
export const reportItem = (id, reason) => api.post(`/buysell/${id}/report`, { reason }).then(r => r.data);
