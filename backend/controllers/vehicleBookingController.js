const { ObjectId } = require("mongodb");
const { getDB } = require("../config/db");

const MS_PER_DAY = 1000 * 60 * 60 * 24;

function daysBetween(startDate, endDate) {
  const diff = Math.round((endDate - startDate) / MS_PER_DAY);
  return Math.max(1, diff + 1); // inclusive of both start and end day
}

/* @route  POST /api/vehicle-bookings  (protected — any logged-in user) */
async function createBooking(req, res) {
  try {
    const { vehicleId, startDate, endDate } = req.body;

    if (!vehicleId || !startDate || !endDate) {
      return res.status(400).json({ success: false, message: "Vehicle, start date, and end date are required" });
    }

    const start = new Date(startDate);
    const end = new Date(endDate);

    if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime()) || end < start) {
      return res.status(400).json({ success: false, message: "Invalid date range" });
    }

    const db = getDB();
    const vehicle = await db.collection("vehicles").findOne({ _id: new ObjectId(vehicleId) });

    if (!vehicle || vehicle.status !== "approved") {
      return res.status(404).json({ success: false, message: "Vehicle not found or not available" });
    }
    if (!vehicle.available) {
      return res.status(400).json({ success: false, message: "This vehicle isn't available for rent right now" });
    }

    // Block overlapping accepted bookings for the same vehicle
    const overlap = await db.collection("vehicleBookings").findOne({
      vehicleId: vehicle._id.toString(),
      status: "accepted",
      startDate: { $lte: end },
      endDate: { $gte: start }
    });

    if (overlap) {
      return res.status(409).json({ success: false, message: "This vehicle is already booked for those dates" });
    }

    const days = daysBetween(start, end);
    const rentalAmount = days * vehicle.pricePerDay;

    const booking = {
      vehicleId: vehicle._id.toString(),
      vehicleOwnerId: vehicle.ownerId,
      customerId: req.user.id,
      vehicleName: `${vehicle.brand} ${vehicle.model}`,
      vehicleType: vehicle.type,
      startDate: start,
      endDate: end,
      days,
      pricePerDay: vehicle.pricePerDay,
      rentalAmount,
      securityDeposit: vehicle.securityDeposit,
      status: "pending",
      createdAt: new Date()
    };

    const result = await db.collection("vehicleBookings").insertOne(booking);

    res.status(201).json({
      success: true,
      message: "Booking request sent to the owner",
      id: result.insertedId,
      data: booking
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
}

/* @route  GET /api/vehicle-bookings/mine  (protected — customer's own rentals) */
async function getMyBookings(req, res) {
  try {
    const db = getDB();
    const bookings = await db
      .collection("vehicleBookings")
      .find({ customerId: req.user.id })
      .sort({ createdAt: -1 })
      .toArray();

    res.json({ success: true, bookings });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
}

/* @route  GET /api/vehicle-bookings/owner  (protected — vehicle_owner, requests for their vehicles) */
async function getOwnerBookings(req, res) {
  try {
    const db = getDB();
    const bookings = await db
      .collection("vehicleBookings")
      .find({ vehicleOwnerId: req.user.id })
      .sort({ createdAt: -1 })
      .toArray();

    res.json({ success: true, bookings });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
}

/* @route  PATCH /api/vehicle-bookings/:id/respond  (protected — vehicle owner accept/reject) */
async function respondBooking(req, res) {
  try {
    const { action } = req.body; // "accept" | "reject"
    if (!["accept", "reject"].includes(action)) {
      return res.status(400).json({ success: false, message: "Invalid action" });
    }

    const db = getDB();
    const booking = await db.collection("vehicleBookings").findOne({ _id: new ObjectId(req.params.id) });

    if (!booking) return res.status(404).json({ success: false, message: "Booking not found" });
    if (booking.vehicleOwnerId !== req.user.id) {
      return res.status(403).json({ success: false, message: "Not allowed" });
    }
    if (booking.status !== "pending") {
      return res.status(400).json({ success: false, message: "This booking has already been responded to" });
    }

    const newStatus = action === "accept" ? "accepted" : "rejected";
    await db.collection("vehicleBookings").updateOne({ _id: booking._id }, { $set: { status: newStatus } });

    res.json({ success: true, message: `Booking ${newStatus}` });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
}

module.exports = { createBooking, getMyBookings, getOwnerBookings, respondBooking };
