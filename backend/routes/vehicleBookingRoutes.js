const express = require("express");
const router = express.Router();

const {
  createBooking, getMyBookings, getOwnerBookings, respondBooking
} = require("../controllers/vehicleBookingController");
const { verifyToken } = require("../middleware/auth");

router.post("/", verifyToken, createBooking);
router.get("/mine", verifyToken, getMyBookings);
router.get("/owner", verifyToken, getOwnerBookings);
router.patch("/:id/respond", verifyToken, respondBooking);

module.exports = router;
