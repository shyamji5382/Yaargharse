const { ObjectId } = require("mongodb");
const { getDB } = require("../config/db");

const CATEGORIES = ["emergency", "hospital", "police", "pharmacy", "mechanic", "electrician-plumber"];

function buildPhotoUrl(files) {
  if (!files || files.length === 0) return "";
  return `/uploads/studenthelp/${files[0].filename}`;
}

/* @route  GET /api/student-help  (public) */
async function getHelpEntries(req, res) {
  try {
    const db = getDB();
    const entries = await db.collection("studentHelp").find({}).sort({ category: 1, name: 1 }).toArray();
    res.json(entries);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
}

/* @route  POST /api/student-help  (admin only) */
async function createHelpEntry(req, res) {
  try {
    const { category, name, contactNumber, address, availableTime, description, lat, lng } = req.body;

    if (!CATEGORIES.includes(category)) {
      return res.status(400).json({ success: false, message: "Invalid category" });
    }
    if (!name || !contactNumber || !address) {
      return res.status(400).json({ success: false, message: "Name, contact number, and address are required" });
    }

    const db = getDB();
    const entry = {
      category,
      name,
      contactNumber,
      address,
      availableTime: availableTime || "",
      description: description || "",
      photo: buildPhotoUrl(req.files),
      lat: lat ? Number(lat) : null,
      lng: lng ? Number(lng) : null,
      verified: true,
      createdAt: new Date()
    };

    const result = await db.collection("studentHelp").insertOne(entry);
    res.status(201).json({ success: true, message: "Entry added", id: result.insertedId, data: entry });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
}

/* @route  DELETE /api/student-help/:id  (admin only) */
async function deleteHelpEntry(req, res) {
  try {
    const db = getDB();
    await db.collection("studentHelp").deleteOne({ _id: new ObjectId(req.params.id) });
    res.json({ success: true, message: "Entry removed" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
}

module.exports = { getHelpEntries, createHelpEntry, deleteHelpEntry, CATEGORIES };
