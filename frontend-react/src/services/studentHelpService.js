import api from "./api";

export const getHelpEntries = () => api.get("/student-help").then(r => r.data);
export const createHelpEntry = (formData) =>
  api.post("/student-help", formData, { headers: { "Content-Type": "multipart/form-data" } }).then(r => r.data);
export const deleteHelpEntry = (id) => api.delete(`/student-help/${id}`).then(r => r.data);
