const { ObjectId } = require("mongodb");
const { getDB } = require("../config/db");
const { calcSafetyScore } = require("../utils/safetyScore");

const VEHICLE_TYPES = ["scooty", "bike", "ebike", "car"];

function buildPhotoUrls(files) {
  if (!files || files.length === 0) return [];
  return files.map((f) => `/uploads/vehicles/${f.filename}`);
}

/* @route  GET /api/vehicles  (public — only approved) */
async function getVehicles(req, res) {
  try {
    const db = getDB();
    const vehicles = await db
      .collection("vehicles")
      .find({ status: "approved" })
      .sort({ rating: -1 })
      .toArray();

    const withScore = vehicles.map((v) => ({ ...v, safetyScore: calcSafetyScore(v) }));

    res.json(withScore);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
}

/* @route  POST /api/vehicles  (protected — vehicle_owner) — multipart/form-data */
async function createVehicle(req, res) {
  try {
    const { type, brand, model, address, lat, lng, pricePerDay, securityDeposit, details, contactNumber } = req.body;

    if (!VEHICLE_TYPES.includes(type)) {
      return res.status(400).json({ success: false, message: "Invalid vehicle type" });
    }
    if (!brand || !model || !pricePerDay || !address || !contactNumber) {
      return res.status(400).json({
        success: false,
        message: "Brand, model, price per day, address, and contact number are required"
      });
    }
    if (lat === undefined || lng === undefined || lat === "" || lng === "") {
      return res.status(400).json({
        success: false,
        message: "Location wasn't captured — allow location access and try again"
      });
    }

    const photos = buildPhotoUrls(req.files);
    if (photos.length === 0) {
      return res.status(400).json({ success: false, message: "At least 1 photo is required" });
    }

    const db = getDB();

    const vehicle = {
      type,
      brand,
      model,
      address,
      lat: Number(lat),
      lng: Number(lng),
      pricePerDay: Number(pricePerDay),
      securityDeposit: Number(securityDeposit) || 0,
      details: details || "",
      contactNumber,
      photos,
      available: true,
      rating: 0,
      verified: false,
      ownerId: req.user.id,
      status: "pending",
      createdAt: new Date()
    };

    const result = await db.collection("vehicles").insertOne(vehicle);

    res.status(201).json({
      success: true,
      message: "Vehicle submitted for review",
      id: result.insertedId,
      data: vehicle
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
}

/* @route  GET /api/vehicles/mine  (protected — vehicle_owner) */
async function getMyVehicles(req, res) {
  try {
    const db = getDB();
    const vehicles = await db
      .collection("vehicles")
      .find({ ownerId: req.user.id })
      .sort({ createdAt: -1 })
      .toArray();

    res.json({ success: true, vehicles });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
}

/* @route  PATCH /api/vehicles/:id/availability  (protected — owner only) */
async function updateAvailability(req, res) {
  try {
    const db = getDB();
    const vehicle = await db.collection("vehicles").findOne({ _id: new ObjectId(req.params.id) });

    if (!vehicle) return res.status(404).json({ success: false, message: "Vehicle not found" });
    if (vehicle.ownerId !== req.user.id) return res.status(403).json({ success: false, message: "Not allowed" });

    const available = !!req.body.available;
    await db.collection("vehicles").updateOne({ _id: vehicle._id }, { $set: { available } });

    res.json({ success: true, message: "Availability updated", available });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
}

/* @route  DELETE /api/vehicles/:id  (protected — owner or admin) */
async function deleteVehicle(req, res) {
  try {
    const db = getDB();
    const vehicle = await db.collection("vehicles").findOne({ _id: new ObjectId(req.params.id) });

    if (!vehicle) return res.status(404).json({ success: false, message: "Vehicle not found" });
    if (vehicle.ownerId !== req.user.id && req.user.role !== "admin") {
      return res.status(403).json({ success: false, message: "Not allowed" });
    }

    await db.collection("vehicles").deleteOne({ _id: vehicle._id });
    res.json({ success: true, message: "Vehicle deleted" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
}

module.exports = { getVehicles, createVehicle, getMyVehicles, updateAvailability, deleteVehicle, VEHICLE_TYPES };
