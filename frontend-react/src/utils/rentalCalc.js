const MS_PER_DAY = 1000 * 60 * 60 * 24;

// Inclusive of both start and end day — matches backend logic exactly
export function computeDays(startDate, endDate) {
  if (!startDate || !endDate) return 0;
  const start = new Date(startDate);
  const end = new Date(endDate);
  if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime()) || end < start) return 0;
  return Math.max(1, Math.round((end - start) / MS_PER_DAY) + 1);
}

export function computeRentalAmount(pricePerDay, days) {
  return Math.max(0, pricePerDay) * Math.max(0, days);
}
