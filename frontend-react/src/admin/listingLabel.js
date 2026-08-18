// Returns { title, subtitle } for any listing type shown in admin lists
export function getListingLabel(item, kind) {
  if (kind === "rooms" || kind === "verifiedRooms") {
    return { title: item.name, subtitle: `₹${item.rent}/month · ${item.roomType}` };
  }
  if (kind === "vehicles" || kind === "verifiedVehicles") {
    return { title: `${item.brand} ${item.model}`, subtitle: `₹${item.pricePerDay}/day · ${item.type}` };
  }
  if (kind === "libraries" || kind === "verifiedLibraries") {
    return { title: item.name, subtitle: `₹${item.price}/month · ${item.availableSeats} seats` };
  }
  if (kind === "services" || kind === "verifiedServices") {
    return { title: item.name, subtitle: item.category };
  }
  if (kind === "buysell") {
    return { title: item.itemName, subtitle: `₹${item.price?.toLocaleString("en-IN")} · ${item.condition}` };
  }
  return { title: item.name, subtitle: `₹${item.pricePerMeal}/meal · ${item.type}` };
}
