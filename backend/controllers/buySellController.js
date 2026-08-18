const { ObjectId } = require("mongodb");
const { getDB } = require("../config/db");

const CATEGORIES = ["books", "furniture", "calculator", "electronics", "study-items", "other"];
const CONDITIONS = ["new", "like-new", "good", "fair"];

function buildPhotoUrls(files) {
  if (!files || files.length === 0) return [];
  return files.map((f) => `/uploads/buysell/${f.filename}`);
}

/* @route  GET /api/buysell  (public — only approved items, sold or not) */
async function getItems(req, res) {
  try {
    const db = getDB();
    const items = await db
      .collection("buysell")
      .find({ status: "approved" })
      .sort({ createdAt: -1 })
      .toArray();

    res.json(items);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
}

/* @route  POST /api/buysell  (protected — any logged-in user) — multipart/form-data */
async function createItem(req, res) {
  try {
    const { itemName, category, price, condition, address, description, showContact, contactNumber } = req.body;

    if (!itemName || !category || !price || !condition || !address) {
      return res.status(400).json({
        success: false,
        message: "Item name, category, price, condition, and location are required"
      });
    }
    if (!CATEGORIES.includes(category)) {
      return res.status(400).json({ success: false, message: "Invalid category" });
    }
    if (!CONDITIONS.includes(condition)) {
      return res.status(400).json({ success: false, message: "Invalid condition" });
    }

    const photos = buildPhotoUrls(req.files);
    if (photos.length === 0) {
      return res.status(400).json({ success: false, message: "At least 1 photo is required" });
    }

    const db = getDB();
    const seller = await db.collection("users").findOne({ _id: new ObjectId(req.user.id) });

    const item = {
      itemName,
      category,
      price: Number(price),
      condition,
      address,
      description: description || "",
      photos,
      showContact: showContact === "true" || showContact === true,
      contactNumber: (showContact === "true" || showContact === true) ? (contactNumber || "") : "",
      sellerId: req.user.id,
      sellerName: seller?.name || "Student",
      sold: false,
      status: "pending",
      createdAt: new Date()
    };

    const result = await db.collection("buysell").insertOne(item);

    res.status(201).json({
      success: true,
      message: "Item submitted for review",
      id: result.insertedId,
      data: item
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
}

/* @route  GET /api/buysell/mine  (protected — seller's own listings, any status) */
async function getMyItems(req, res) {
  try {
    const db = getDB();
    const items = await db
      .collection("buysell")
      .find({ sellerId: req.user.id })
      .sort({ createdAt: -1 })
      .toArray();

    res.json({ success: true, items });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
}

/* @route  PATCH /api/buysell/:id/sold  (protected — seller only) */
async function markSold(req, res) {
  try {
    const db = getDB();
    const item = await db.collection("buysell").findOne({ _id: new ObjectId(req.params.id) });

    if (!item) return res.status(404).json({ success: false, message: "Item not found" });
    if (item.sellerId !== req.user.id) return res.status(403).json({ success: false, message: "Not allowed" });

    const sold = req.body.sold !== undefined ? !!req.body.sold : true;
    await db.collection("buysell").updateOne({ _id: item._id }, { $set: { sold } });

    res.json({ success: true, message: sold ? "Marked as sold" : "Marked as available", sold });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
}

/* @route  DELETE /api/buysell/:id  (protected — seller or admin) */
async function deleteItem(req, res) {
  try {
    const db = getDB();
    const item = await db.collection("buysell").findOne({ _id: new ObjectId(req.params.id) });

    if (!item) return res.status(404).json({ success: false, message: "Item not found" });
    if (item.sellerId !== req.user.id && req.user.role !== "admin") {
      return res.status(403).json({ success: false, message: "Not allowed" });
    }

    await db.collection("buysell").deleteOne({ _id: item._id });
    res.json({ success: true, message: "Listing removed" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
}

/* @route  POST /api/buysell/:id/report  (protected — any logged-in user) */
async function reportItem(req, res) {
  try {
    const db = getDB();
    const item = await db.collection("buysell").findOne({ _id: new ObjectId(req.params.id) });
    if (!item) return res.status(404).json({ success: false, message: "Item not found" });

    await db.collection("buysellReports").insertOne({
      itemId: item._id.toString(),
      itemName: item.itemName,
      reporterId: req.user.id,
      reason: (req.body.reason || "").toString().slice(0, 500),
      createdAt: new Date()
    });

    res.status(201).json({ success: true, message: "Report submitted — thanks for flagging this" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
}

module.exports = { getItems, createItem, getMyItems, markSold, deleteItem, reportItem, CATEGORIES, CONDITIONS };
