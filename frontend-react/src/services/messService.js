import api from "./api";

// Public — approved messes only
export const getMesses = () => api.get("/messes").then(r => r.data);

// Owner
export const getMyMesses = () => api.get("/messes/mine").then(r => r.data);

// formData must be a FormData instance (name, type, cuisine, address, lat, lng,
// pricePerMeal, priceMonthly, timing, weeklyMenu (JSON string), photos[])
export const createMess = (formData) =>
  api.post("/messes", formData, {
    headers: { "Content-Type": "multipart/form-data" }
  }).then(r => r.data);

export const deleteMess = (id) => api.delete(`/messes/${id}`).then(r => r.data);
