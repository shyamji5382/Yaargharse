export const ROLES = {
  STUDENT: "student",
  MESS_OWNER: "mess_owner",
  ROOM_OWNER: "room_owner",
  VEHICLE_OWNER: "vehicle_owner",
  LIBRARY_OWNER: "library_owner",
  SERVICE_PROVIDER: "service_provider",
  ADMIN: "admin"
};

export const VEHICLE_TYPES = [
  { key: "scooty", label: "🛵 Scooty" },
  { key: "bike", label: "🏍️ Bike" },
  { key: "ebike", label: "⚡ E-bike" },
  { key: "car", label: "🚗 Car" }
];

export const ITEM_CATEGORIES = [
  { key: "books", label: "📚 Books" },
  { key: "furniture", label: "🪑 Furniture" },
  { key: "calculator", label: "🧮 Calculator" },
  { key: "electronics", label: "💻 Electronics" },
  { key: "study-items", label: "🎒 Study Items" },
  { key: "other", label: "Other" }
];

export const ITEM_CONDITIONS = [
  { key: "new", label: "New" },
  { key: "like-new", label: "Like New" },
  { key: "good", label: "Good" },
  { key: "fair", label: "Fair" }
];

export const SERVICE_CATEGORIES = [
  { key: "laundry", label: "🧺 Laundry" },
  { key: "printing", label: "🖨️ Printing & Photocopy" },
  { key: "stationery", label: "✏️ Stationery" },
  { key: "water", label: "💧 Water/RO" },
  { key: "electrician-plumber", label: "🔧 Electrician/Plumber" },
  { key: "cleaning", label: "🧹 Cleaning" }
];

export const HELP_CATEGORIES = [
  { key: "emergency", label: "🚨 Emergency Contacts" },
  { key: "hospital", label: "🏥 Nearby Hospitals" },
  { key: "police", label: "👮 Police Station" },
  { key: "pharmacy", label: "💊 Pharmacy" },
  { key: "mechanic", label: "🛵 Mechanic" },
  { key: "electrician-plumber", label: "🔧 Electrician / Plumber" }
];

export const DAYS = [
  { key: "monday", label: "Monday" },
  { key: "tuesday", label: "Tuesday" },
  { key: "wednesday", label: "Wednesday" },
  { key: "thursday", label: "Thursday" },
  { key: "friday", label: "Friday" },
  { key: "saturday", label: "Saturday" },
  { key: "sunday", label: "Sunday" }
];

export const MEALS = ["breakfast", "lunch", "dinner"];

// Backend origin (without /api) — used to resolve uploaded photo URLs
export const SERVER_ORIGIN = (import.meta.env.VITE_API_URL || "http://localhost:5000/api").replace(/\/api\/?$/, "");

export function photoUrl(path) {
  if (!path) return "";
  return path.startsWith("http") ? path : `${SERVER_ORIGIN}${path}`;
}
