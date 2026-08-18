import api from "./api";

export const submitReview = (targetType, targetId, rating, text) =>
  api.post("/reviews", { targetType, targetId, rating, text }).then(r => r.data);

export const getReviews = (targetType, targetId) =>
  api.get(`/reviews/${targetType}/${targetId}`).then(r => r.data);
