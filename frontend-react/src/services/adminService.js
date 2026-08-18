import api from "./api";

export const getPending = () => api.get("/admin/pending").then(r => r.data);
export const approveMess = (id) => api.patch(`/admin/messes/${id}/approve`).then(r => r.data);
export const rejectMess = (id) => api.delete(`/admin/messes/${id}`).then(r => r.data);
export const approveRoom = (id) => api.patch(`/admin/rooms/${id}/approve`).then(r => r.data);
export const rejectRoom = (id) => api.delete(`/admin/rooms/${id}`).then(r => r.data);
export const getUsers = () => api.get("/admin/users").then(r => r.data);

export const getVerified = () => api.get("/admin/verified").then(r => r.data);
export const unverifyMess = (id) => api.patch(`/admin/messes/${id}/unverify`).then(r => r.data);
export const unverifyRoom = (id) => api.patch(`/admin/rooms/${id}/unverify`).then(r => r.data);

export const approveVehicle = (id) => api.patch(`/admin/vehicles/${id}/approve`).then(r => r.data);
export const rejectVehicle = (id) => api.delete(`/admin/vehicles/${id}`).then(r => r.data);
export const unverifyVehicle = (id) => api.patch(`/admin/vehicles/${id}/unverify`).then(r => r.data);

export const approveItem = (id) => api.patch(`/admin/buysell/${id}/approve`).then(r => r.data);
export const rejectItem = (id) => api.delete(`/admin/buysell/${id}`).then(r => r.data);
export const getReports = () => api.get("/admin/reports").then(r => r.data);

export const approveLibrary = (id) => api.patch(`/admin/libraries/${id}/approve`).then(r => r.data);
export const rejectLibrary = (id) => api.delete(`/admin/libraries/${id}`).then(r => r.data);
export const unverifyLibrary = (id) => api.patch(`/admin/libraries/${id}/unverify`).then(r => r.data);

export const approveService = (id) => api.patch(`/admin/services/${id}/approve`).then(r => r.data);
export const rejectService = (id) => api.delete(`/admin/services/${id}`).then(r => r.data);
export const unverifyService = (id) => api.patch(`/admin/services/${id}/unverify`).then(r => r.data);
