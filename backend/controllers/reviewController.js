const { ObjectId } = require("mongodb");
const { getDB } = require("../config/db");

const TARGET_COLLECTIONS = {
  room: "rooms",
  mess: "messes",
  library: "libraries",
  vehicle: "vehicles",
  service: "services"
};

async function recalcAverageRating(db, targetType, collectionName, targetId) {
  const reviews = await db.collection("reviews").find({ targetType, targetId }).toArray();
  const avg = reviews.length ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length : 0;
  await db.collection(collectionName).updateOne(
    { _id: new ObjectId(targetId) },
    { $set: { rating: Math.round(avg * 10) / 10 } }
  );
}

/* @route  POST /api/reviews  (protected) */
async function createReview(req, res) {
  try {
    const { targetType, targetId, rating, text } = req.body;

    const collectionName = TARGET_COLLECTIONS[targetType];
    if (!collectionName) {
      return res.status(400).json({ success: false, message: "Invalid review target" });
    }

    const ratingNum = Number(rating);
    if (!ratingNum || ratingNum < 1 || ratingNum > 5) {
      return res.status(400).json({ success: false, message: "Rating must be between 1 and 5" });
    }

    const db = getDB();
    const target = await db.collection(collectionName).findOne({ _id: new ObjectId(targetId) });
    if (!target) {
      return res.status(404).json({ success: false, message: "Listing not found" });
    }

    // For vehicles, require a genuine completed/accepted booking by this user for this vehicle
    if (targetType === "vehicle") {
      const hasBooking = await db.collection("vehicleBookings").findOne({
        vehicleId: targetId,
        customerId: req.user.id,
        status: "accepted"
      });
      if (!hasBooking) {
        return res.status(403).json({
          success: false,
          message: "You can only review a vehicle after a confirmed booking"
        });
      }
    }

    // One review per user per listing — update if it already exists
    const existing = await db.collection("reviews").findOne({
      targetType, targetId, userId: req.user.id
    });

    const user = await db.collection("users").findOne({ _id: new ObjectId(req.user.id) });

    if (existing) {
      await db.collection("reviews").updateOne(
        { _id: existing._id },
        { $set: { rating: ratingNum, text: (text || "").slice(0, 500), updatedAt: new Date() } }
      );
    } else {
      await db.collection("reviews").insertOne({
        targetType,
        targetId,
        userId: req.user.id,
        userName: user?.name || "Student",
        rating: ratingNum,
        text: (text || "").slice(0, 500),
        createdAt: new Date()
      });
    }

    await recalcAverageRating(db, targetType, collectionName, targetId);

    res.status(201).json({ success: true, message: "Review saved" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
}

/* @route  GET /api/reviews/:targetType/:targetId  (public) */
async function getReviews(req, res) {
  try {
    const { targetType, targetId } = req.params;
    if (!TARGET_COLLECTIONS[targetType]) {
      return res.status(400).json({ success: false, message: "Invalid review target" });
    }

    const db = getDB();
    const reviews = await db.collection("reviews")
      .find({ targetType, targetId })
      .sort({ createdAt: -1 })
      .toArray();

    const avg = reviews.length ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length : 0;

    res.json({ success: true, reviews, average: Math.round(avg * 10) / 10, count: reviews.length });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
}

module.exports = { createReview, getReviews };
