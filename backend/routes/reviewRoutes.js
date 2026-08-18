const express = require("express");
const router = express.Router();
const { createReview, getReviews } = require("../controllers/reviewController");
const { verifyToken } = require("../middleware/auth");

router.post("/", verifyToken, createReview);
router.get("/:targetType/:targetId", getReviews);

module.exports = router;
