const { ObjectId } = require("mongodb");
const { getDB } = require("../config/db");
const { calcSafetyScore } = require("../utils/safetyScore");

const DAYS = ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"];

function buildPhotoUrls(files) {
  if (!files || files.length === 0) return [];
  return files.map((f) => `/uploads/messes/${f.filename}`);
}

function parseWeeklyMenu(raw) {
  let menu;
  try {
    menu = typeof raw === "string" ? JSON.parse(raw) : raw;
  } catch {
    return null;
  }
  if (!menu || typeof menu !== "object") return null;

  const cleanMenu = {};
  for (const day of DAYS) {
    const dayMenu = menu[day] || {};
    cleanMenu[day] = {
      breakfast: (dayMenu.breakfast || "").toString().trim(),
      lunch: (dayMenu.lunch || "").toString().trim(),
      dinner: (dayMenu.dinner || "").toString().trim()
    };
  }
  return cleanMenu;
}

/* @route  GET /api/messes  (public — only approved) */
async function getMesses(req, res) {
  try {
    const db = getDB();
    const messes = await db
      .collection("messes")
      .find({ status: "approved" })
      .sort({ rating: -1 })
      .toArray();

    const withScore = messes.map((m) => ({ ...m, safetyScore: calcSafetyScore(m) }));

    res.json(withScore);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
}

/* @route  POST /api/messes  (protected — mess_owner) — multipart/form-data */
async function createMess(req, res) {
  try {
    const {
      name, type, cuisine, address, lat, lng,
      pricePerMeal, priceMonthly, timing, weeklyMenu
    } = req.body;

    if (!name || !type || !pricePerMeal || !priceMonthly || !address) {
      return res.status(400).json({
        success: false,
        message: "Name, type, price, and address are required"
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
      return res.status(400).json({
        success: false,
        message: "At least 1 photo of your mess is required"
      });
    }

    const cleanMenu = parseWeeklyMenu(weeklyMenu);
    if (!cleanMenu) {
      return res.status(400).json({
        success: false,
        message: "Please fill in the weekly menu (Monday to Sunday)"
      });
    }

    const db = getDB();

    const mess = {
      name,
      type,
      cuisine: cuisine ? cuisine.split(",").map((s) => s.trim()).filter(Boolean) : [],
      address,
      lat: Number(lat),
      lng: Number(lng),
      pricePerMeal: Number(pricePerMeal),
      priceMonthly: Number(priceMonthly),
      timing: timing || "",
      weeklyMenu: cleanMenu,
      photos,
      rating: 0,
      verified: false,
      ownerId: req.user.id,
      status: "pending",
      createdAt: new Date()
    };

    const result = await db.collection("messes").insertOne(mess);

    res.status(201).json({
      success: true,
      message: "Mess submitted for review",
      id: result.insertedId,
      data: mess
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
}

/* @route  GET /api/messes/mine  (protected — mess_owner, their own listings, any status) */
async function getMyMesses(req, res) {
  try {
    const db = getDB();
    const messes = await db
      .collection("messes")
      .find({ ownerId: req.user.id })
      .sort({ createdAt: -1 })
      .toArray();

    res.json({ success: true, messes });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
}

/* @route  DELETE /api/messes/:id  (protected — owner of that mess, or admin) */
async function deleteMess(req, res) {
  try {
    const db = getDB();
    const mess = await db.collection("messes").findOne({ _id: new ObjectId(req.params.id) });

    if (!mess) {
      return res.status(404).json({ success: false, message: "Mess not found" });
    }

    if (mess.ownerId !== req.user.id && req.user.role !== "admin") {
      return res.status(403).json({ success: false, message: "Not allowed" });
    }

    await db.collection("messes").deleteOne({ _id: mess._id });

    res.json({ success: true, message: "Mess deleted" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
}

module.exports = { getMesses, createMess, getMyMesses, deleteMess };
