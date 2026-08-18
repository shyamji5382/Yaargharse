import { haversine } from "./distance";

/*
  Rule-based Smart Match — NOT generative AI, no invented data.
  Every score component is derived from real fields on real, approved listings.

  Hard filters (a room is excluded entirely if it fails these):
    - outside maxDistance
    - rent above budget
    - room type doesn't match (unless "any")
    - mess required but no matching mess found nearby

  Soft scoring (0-100), used only to RANK rooms that already passed the filters:
    - Budget headroom   → up to 40 pts
    - Distance          → up to 30 pts
    - Room type match   → 15 pts
    - Nearby mess found → 5-10 pts
    - Real rating bonus → up to 5 pts
*/
export function computeMatches({ rooms, messes, budget, maxDistance, roomType, foodPreference, messRequired, coords }) {
  if (!coords) return [];

  const withDist = rooms
    .filter((r) => typeof r.lat === "number" && typeof r.lng === "number")
    .map((r) => ({ ...r, dist: haversine(coords.lat, coords.lng, r.lat, r.lng) }));

  const filtered = withDist
    .filter((r) => r.dist <= maxDistance)
    .filter((r) => budget <= 0 || r.rent <= budget)
    .filter((r) => roomType === "any" || r.roomType === roomType);

  const withMess = filtered.map((r) => {
    const nearbyMess = messes
      .filter((m) => typeof m.lat === "number" && typeof m.lng === "number")
      .map((m) => ({ ...m, distToRoom: haversine(r.lat, r.lng, m.lat, m.lng) }))
      .filter((m) => m.distToRoom <= maxDistance)
      .filter((m) => foodPreference === "any" || m.type === foodPreference || m.type === "both")
      .sort((a, b) => a.distToRoom - b.distToRoom)[0] || null;

    return { ...r, nearbyMess };
  });

  const eligible = withMess.filter((r) => !messRequired || r.nearbyMess);

  const scored = eligible.map((r) => {
    const budgetRatio = budget > 0 ? Math.min(r.rent / budget, 1) : 0.5;
    const budgetScore = 40 * (1 - budgetRatio * 0.4);

    const distScore = 30 * (1 - Math.min(r.dist / maxDistance, 1));

    const typeScore = roomType === "any" || r.roomType === roomType ? 15 : 0;

    const messScore = messRequired ? (r.nearbyMess ? 10 : 0) : (r.nearbyMess ? 5 : 0);

    const ratingScore = r.rating > 0 ? (r.rating / 5) * 5 : 0;

    const matchScore = Math.round(Math.min(100, budgetScore + distScore + typeScore + messScore + ratingScore));

    return { ...r, matchScore };
  });

  return scored.sort((a, b) => b.matchScore - a.matchScore).slice(0, 5);
}
