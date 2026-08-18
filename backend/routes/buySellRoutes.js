const express = require("express");
const router = express.Router();

const {
  getItems, createItem, getMyItems, markSold, deleteItem, reportItem
} = require("../controllers/buySellController");
const { verifyToken } = require("../middleware/auth");
const { buySellUpload } = require("../middleware/upload");

router.get("/", getItems);
router.get("/mine", verifyToken, getMyItems);
router.post("/", verifyToken, buySellUpload.array("photos", 5), createItem);
router.patch("/:id/sold", verifyToken, markSold);
router.delete("/:id", verifyToken, deleteItem);
router.post("/:id/report", verifyToken, reportItem);

module.exports = router;
