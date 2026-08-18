/*
  Rule-based Safety Score — NEVER invented.
  Only computed from real, available data:
    - verification status (admin-approved)
    - actual customer rating (once reviews exist)

  Returns a number 0-100, or null if there isn't enough real data yet
  (e.g. not verified, or no ratings collected so far).
*/
function calcSafetyScore(item) {
  if (!item.verified) return null;
  if (!item.rating || item.rating <= 0) return null;

  const score = Math.round(60 + (item.rating / 5) * 40);
  return Math.min(100, score);
}

module.exports = { calcSafetyScore };
