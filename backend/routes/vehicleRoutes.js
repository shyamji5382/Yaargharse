const express = require("express");
const router = express.Router();

const {
  getVehicles, createVehicle, getMyVehicles, updateAvailability, deleteVehicle
} = require("../controllers/vehicleController");
const { verifyToken, requireRole } = require("../middleware/auth");
const { vehicleUpload } = require("../middleware/upload");

router.get("/", getVehicles);
router.get("/mine", verifyToken, requireRole("vehicle_owner", "admin"), getMyVehicles);
router.post("/", verifyToken, requireRole("vehicle_owner", "admin"), vehicleUpload.array("photos", 6), createVehicle);
router.patch("/:id/availability", verifyToken, requireRole("vehicle_owner", "admin"), updateAvailability);
router.delete("/:id", verifyToken, requireRole("vehicle_owner", "admin"), deleteVehicle);

module.exports = router;
