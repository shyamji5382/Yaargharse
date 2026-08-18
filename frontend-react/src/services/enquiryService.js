import api from "./api";

export const sendEnquiry = (data) => api.post("/enquiries", data).then(r => r.data);
