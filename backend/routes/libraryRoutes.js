const express = require("express");
const router = express.Router();
const { getLibraries, createLibrary, getMyLibraries, updateAvailability, deleteLibrary } = require("../controllers/libraryController");
const { verifyToken, requireRole } = require("../middleware/auth");
const { libraryUpload } = require("../middleware/upload");

router.get("/", getLibraries);
router.get("/mine", verifyToken, requireRole("library_owner", "admin"), getMyLibraries);
router.post("/", verifyToken, requireRole("library_owner", "admin"), libraryUpload.array("photos", 6), createLibrary);
router.patch("/:id/availability", verifyToken, requireRole("library_owner", "admin"), updateAvailability);
router.delete("/:id", verifyToken, requireRole("library_owner", "admin"), deleteLibrary);

module.exports = router;
