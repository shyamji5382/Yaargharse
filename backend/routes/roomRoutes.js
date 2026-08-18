const express = require("express");
const router = express.Router();

const { getRooms, createRoom, getMyRooms, deleteRoom } = require("../controllers/roomController");
const { verifyToken, requireRole } = require("../middleware/auth");
const { roomUpload } = require("../middleware/upload");

router.get("/", getRooms);
router.get("/mine", verifyToken, requireRole("room_owner", "admin"), getMyRooms);
router.post("/", verifyToken, requireRole("room_owner", "admin"), roomUpload.array("photos", 6), createRoom);
router.delete("/:id", verifyToken, requireRole("room_owner", "admin"), deleteRoom);

module.exports = router;
