const express = require("express");
const router = express.Router();

const { getMesses, createMess, getMyMesses, deleteMess } = require("../controllers/messController");
const { verifyToken, requireRole } = require("../middleware/auth");
const { messUpload } = require("../middleware/upload");

router.get("/", getMesses);
router.get("/mine", verifyToken, requireRole("mess_owner", "admin"), getMyMesses);
router.post("/", verifyToken, requireRole("mess_owner", "admin"), messUpload.array("photos", 5), createMess);
router.delete("/:id", verifyToken, requireRole("mess_owner", "admin"), deleteMess);

module.exports = router;
