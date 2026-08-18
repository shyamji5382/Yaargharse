const { ObjectId } = require("mongodb");
const { getDB } = require("../config/db");
const { calcSafetyScore } = require("../utils/safetyScore");

const CATEGORIES = ["laundry", "printing", "stationery", "water", "electrician-plumber", "cleaning"];

function buildPhotoUrls(files) {
  if (!files || files.length === 0) return [];
  return files.map((f) => `/uploads/services/${f.filename}`);
}

async function getServices(req, res) {
  try {
    const db = getDB();
    const services = await db.collection("services").find({ status: "approved" }).sort({ rating: -1 }).toArray();
    res.json(services.map((s) => ({ ...s, safetyScore: calcSafetyScore(s) })));
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
}

async function createService(req, res) {
  try {
    const { name, category, address, lat, lng, price, availableTime, contactNumber, description } = req.body;

    if (!CATEGORIES.includes(category)) {
      return res.status(400).json({ success: false, message: "Invalid category" });
    }
    if (!name || !address || !contactNumber) {
      return res.status(400).json({ success: false, message: "Name, address, and contact number are required" });
    }
    if (lat === undefined || lng === undefined || lat === "" || lng === "") {
      return res.status(400).json({ success: false, message: "Location wasn't captured — allow location access and try again" });
    }

    const photos = buildPhotoUrls(req.files);
    if (photos.length === 0) {
      return res.status(400).json({ success: false, message: "At least 1 photo is required" });
    }

    const db = getDB();
    const service = {
      name,
      category,
      address,
      lat: Number(lat),
      lng: Number(lng),
      price: price ? Number(price) : null,
      availableTime: availableTime || "",
      contactNumber,
      description: description || "",
      photos,
      available: true,
      rating: 0,
      verified: false,
      ownerId: req.user.id,
      status: "pending",
      createdAt: new Date()
    };

    const result = await db.collection("services").insertOne(service);
    res.status(201).json({ success: true, message: "Service submitted for review", id: result.insertedId, data: service });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
}

async function getMyServices(req, res) {
  try {
    const db = getDB();
    const services = await db.collection("services").find({ ownerId: req.user.id }).sort({ createdAt: -1 }).toArray();
    res.json({ success: true, services });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
}

async function updateAvailability(req, res) {
  try {
    const db = getDB();
    const service = await db.collection("services").findOne({ _id: new ObjectId(req.params.id) });
    if (!service) return res.status(404).json({ success: false, message: "Service not found" });
    if (service.ownerId !== req.user.id) return res.status(403).json({ success: false, message: "Not allowed" });

    const available = !!req.body.available;
    await db.collection("services").updateOne({ _id: service._id }, { $set: { available } });
    res.json({ success: true, message: "Availability updated", available });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
}

async function deleteService(req, res) {
  try {
    const db = getDB();
    const service = await db.collection("services").findOne({ _id: new ObjectId(req.params.id) });
    if (!service) return res.status(404).json({ success: false, message: "Service not found" });
    if (service.ownerId !== req.user.id && req.user.role !== "admin") {
      return res.status(403).json({ success: false, message: "Not allowed" });
    }
    await db.collection("services").deleteOne({ _id: service._id });
    res.json({ success: true, message: "Service deleted" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
}

module.exports = { getServices, createService, getMyServices, updateAvailability, deleteService, CATEGORIES };
