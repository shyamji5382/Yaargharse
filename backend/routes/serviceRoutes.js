const express = require("express");
const router = express.Router();
const { getServices, createService, getMyServices, updateAvailability, deleteService } = require("../controllers/serviceController");
const { verifyToken, requireRole } = require("../middleware/auth");
const { serviceUpload } = require("../middleware/upload");

router.get("/", getServices);
router.get("/mine", verifyToken, requireRole("service_provider", "admin"), getMyServices);
router.post("/", verifyToken, requireRole("service_provider", "admin"), serviceUpload.array("photos", 6), createService);
router.patch("/:id/availability", verifyToken, requireRole("service_provider", "admin"), updateAvailability);
router.delete("/:id", verifyToken, requireRole("service_provider", "admin"), deleteService);

module.exports = router;
