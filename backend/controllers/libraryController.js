const { ObjectId } = require("mongodb");
const { getDB } = require("../config/db");
const { calcSafetyScore } = require("../utils/safetyScore");

function buildPhotoUrls(files) {
  if (!files || files.length === 0) return [];
  return files.map((f) => `/uploads/libraries/${f.filename}`);
}

async function getLibraries(req, res) {
  try {
    const db = getDB();
    const libraries = await db.collection("libraries").find({ status: "approved" }).sort({ rating: -1 }).toArray();
    res.json(libraries.map((l) => ({ ...l, safetyScore: calcSafetyScore(l) })));
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
}

async function createLibrary(req, res) {
  try {
    const { name, address, lat, lng, price, availableSeats, openingHours, facilities, contactNumber, description } = req.body;

    if (!name || !address || !price || !availableSeats || !contactNumber) {
      return res.status(400).json({ success: false, message: "Name, address, price, seats, and contact number are required" });
    }
    if (lat === undefined || lng === undefined || lat === "" || lng === "") {
      return res.status(400).json({ success: false, message: "Location wasn't captured — allow location access and try again" });
    }

    const photos = buildPhotoUrls(req.files);
    if (photos.length === 0) {
      return res.status(400).json({ success: false, message: "At least 1 photo is required" });
    }

    const db = getDB();
    const library = {
      name,
      address,
      lat: Number(lat),
      lng: Number(lng),
      price: Number(price),
      availableSeats: Number(availableSeats),
      openingHours: openingHours || "",
      facilities: facilities ? facilities.split(",").map((s) => s.trim()).filter(Boolean) : [],
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

    const result = await db.collection("libraries").insertOne(library);
    res.status(201).json({ success: true, message: "Library submitted for review", id: result.insertedId, data: library });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
}

async function getMyLibraries(req, res) {
  try {
    const db = getDB();
    const libraries = await db.collection("libraries").find({ ownerId: req.user.id }).sort({ createdAt: -1 }).toArray();
    res.json({ success: true, libraries });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
}

async function updateAvailability(req, res) {
  try {
    const db = getDB();
    const library = await db.collection("libraries").findOne({ _id: new ObjectId(req.params.id) });
    if (!library) return res.status(404).json({ success: false, message: "Library not found" });
    if (library.ownerId !== req.user.id) return res.status(403).json({ success: false, message: "Not allowed" });

    const available = !!req.body.available;
    await db.collection("libraries").updateOne({ _id: library._id }, { $set: { available } });
    res.json({ success: true, message: "Availability updated", available });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
}

async function deleteLibrary(req, res) {
  try {
    const db = getDB();
    const library = await db.collection("libraries").findOne({ _id: new ObjectId(req.params.id) });
    if (!library) return res.status(404).json({ success: false, message: "Library not found" });
    if (library.ownerId !== req.user.id && req.user.role !== "admin") {
      return res.status(403).json({ success: false, message: "Not allowed" });
    }
    await db.collection("libraries").deleteOne({ _id: library._id });
    res.json({ success: true, message: "Library deleted" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
}

module.exports = { getLibraries, createLibrary, getMyLibraries, updateAvailability, deleteLibrary };
