const express = require("express");
const router = express.Router();

const {
  getPending, getVerified, getUsers,
  approveMess, rejectMess, unverifyMess,
  approveRoom, rejectRoom, unverifyRoom,
  approveVehicle, rejectVehicle, unverifyVehicle,
  approveLibrary, rejectLibrary, unverifyLibrary,
  approveService, rejectService, unverifyService,
  approveItem, rejectItem, getReports
} = require("../controllers/adminController");
const { verifyToken, requireRole } = require("../middleware/auth");

router.use(verifyToken, requireRole("admin"));

router.get("/pending", getPending);
router.get("/verified", getVerified);

router.patch("/messes/:id/approve", approveMess);
router.delete("/messes/:id", rejectMess);
router.patch("/messes/:id/unverify", unverifyMess);

router.patch("/rooms/:id/approve", approveRoom);
router.delete("/rooms/:id", rejectRoom);
router.patch("/rooms/:id/unverify", unverifyRoom);

router.patch("/vehicles/:id/approve", approveVehicle);
router.delete("/vehicles/:id", rejectVehicle);
router.patch("/vehicles/:id/unverify", unverifyVehicle);

router.patch("/libraries/:id/approve", approveLibrary);
router.delete("/libraries/:id", rejectLibrary);
router.patch("/libraries/:id/unverify", unverifyLibrary);

router.patch("/services/:id/approve", approveService);
router.delete("/services/:id", rejectService);
router.patch("/services/:id/unverify", unverifyService);

router.patch("/buysell/:id/approve", approveItem);
router.delete("/buysell/:id", rejectItem);
router.get("/reports", getReports);

router.get("/users", getUsers);

module.exports = router;
