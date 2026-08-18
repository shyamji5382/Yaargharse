import api from "./api";

export const createBooking = (data) => api.post("/vehicle-bookings", data).then(r => r.data);
export const getMyBookings = () => api.get("/vehicle-bookings/mine").then(r => r.data);
export const getOwnerBookings = () => api.get("/vehicle-bookings/owner").then(r => r.data);
export const respondBooking = (id, action) =>
  api.patch(`/vehicle-bookings/${id}/respond`, { action }).then(r => r.data);
