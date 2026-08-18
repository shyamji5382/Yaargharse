const express = require("express");
const router = express.Router();
const { getHelpEntries, createHelpEntry, deleteHelpEntry } = require("../controllers/studentHelpController");
const { verifyToken, requireRole } = require("../middleware/auth");
const { studentHelpUpload } = require("../middleware/upload");

router.get("/", getHelpEntries);
router.post("/", verifyToken, requireRole("admin"), studentHelpUpload.array("photos", 1), createHelpEntry);
router.delete("/:id", verifyToken, requireRole("admin"), deleteHelpEntry);

module.exports = router;
