const { ObjectId } = require("mongodb");
const { getDB } = require("../config/db");
const { calcSafetyScore } = require("../utils/safetyScore");

const MIN_PHOTOS = 3;

function buildPhotoUrls(files) {
  if (!files || files.length === 0) return [];
  return files.map((f) => `/uploads/rooms/${f.filename}`);
}

/* @route  GET /api/rooms  (public — only approved) */
async function getRooms(req, res) {
  try {
    const db = getDB();
    const rooms = await db
      .collection("rooms")
      .find({ status: "approved" })
      .sort({ rating: -1 })
      .toArray();

    const withScore = rooms.map((r) => ({ ...r, safetyScore: calcSafetyScore(r) }));

    res.json(withScore);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
}

/* @route  POST /api/rooms  (protected — room_owner) — multipart/form-data */
async function createRoom(req, res) {
  try {
    const { name, gender, roomType, address, lat, lng, rent, deposit, facilities } = req.body;

    if (!name || !gender || !roomType || !rent || !address) {
      return res.status(400).json({
        success: false,
        message: "Name, gender, room type, rent, and address are required"
      });
    }

    if (lat === undefined || lng === undefined || lat === "" || lng === "") {
      return res.status(400).json({
        success: false,
        message: "Location wasn't captured — allow location access and try again"
      });
    }

    const photos = buildPhotoUrls(req.files);
    if (photos.length < MIN_PHOTOS) {
      return res.status(400).json({
        success: false,
        message: `Please upload at least ${MIN_PHOTOS} photos of the room`
      });
    }

    const db = getDB();

    const room = {
      name,
      gender,
      roomType,
      address,
      lat: Number(lat),
      lng: Number(lng),
      rent: Number(rent),
      deposit: Number(deposit) || 0,
      facilities: facilities ? facilities.split(",").map((s) => s.trim()).filter(Boolean) : [],
      photos,
      rating: 0,
      verified: false,
      ownerId: req.user.id,
      status: "pending",
      createdAt: new Date()
    };

    const result = await db.collection("rooms").insertOne(room);

    res.status(201).json({
      success: true,
      message: "Room submitted for review",
      id: result.insertedId,
      data: room
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
}

/* @route  GET /api/rooms/mine  (protected — room_owner, their own listings, any status) */
async function getMyRooms(req, res) {
  try {
    const db = getDB();
    const rooms = await db
      .collection("rooms")
      .find({ ownerId: req.user.id })
      .sort({ createdAt: -1 })
      .toArray();

    res.json({ success: true, rooms });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
}

/* @route  DELETE /api/rooms/:id  (protected — owner of that room, or admin) */
async function deleteRoom(req, res) {
  try {
    const db = getDB();
    const room = await db.collection("rooms").findOne({ _id: new ObjectId(req.params.id) });

    if (!room) {
      return res.status(404).json({ success: false, message: "Room not found" });
    }

    if (room.ownerId !== req.user.id && req.user.role !== "admin") {
      return res.status(403).json({ success: false, message: "Not allowed" });
    }

    await db.collection("rooms").deleteOne({ _id: room._id });

    res.json({ success: true, message: "Room deleted" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
}

module.exports = { getRooms, createRoom, getMyRooms, deleteRoom };
