import api from "./api";

// Public — approved rooms only
export const getRooms = () => api.get("/rooms").then(r => r.data);

// Owner
export const getMyRooms = () => api.get("/rooms/mine").then(r => r.data);

// formData must be a FormData instance (name, gender, roomType, address, lat, lng,
// rent, deposit, facilities, photos[] — min 3 photos)
export const createRoom = (formData) =>
  api.post("/rooms", formData, {
    headers: { "Content-Type": "multipart/form-data" }
  }).then(r => r.data);

export const deleteRoom = (id) => api.delete(`/rooms/${id}`).then(r => r.data);
