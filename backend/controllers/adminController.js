const { ObjectId } = require("mongodb");
const { getDB } = require("../config/db");

/* @route  GET /api/admin/pending  (admin) — all pending listings across categories */
async function getPending(req, res) {
  try {
    const db = getDB();

    const [messes, rooms, vehicles, libraries, services] = await Promise.all([
      db.collection("messes").find({ status: "pending" }).sort({ createdAt: -1 }).toArray(),
      db.collection("rooms").find({ status: "pending" }).sort({ createdAt: -1 }).toArray(),
      db.collection("vehicles").find({ status: "pending" }).sort({ createdAt: -1 }).toArray(),
      db.collection("libraries").find({ status: "pending" }).sort({ createdAt: -1 }).toArray(),
      db.collection("services").find({ status: "pending" }).sort({ createdAt: -1 }).toArray()
    ]);
    const buysell = await db.collection("buysell").find({ status: "pending" }).sort({ createdAt: -1 }).toArray();

    res.json({ success: true, messes, rooms, vehicles, libraries, services, buysell });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
}

/* @route  GET /api/admin/verified  (admin) — all currently verified listings across categories */
async function getVerified(req, res) {
  try {
    const db = getDB();

    const [messes, rooms, vehicles, libraries, services] = await Promise.all([
      db.collection("messes").find({ verified: true }).sort({ verifiedAt: -1 }).toArray(),
      db.collection("rooms").find({ verified: true }).sort({ verifiedAt: -1 }).toArray(),
      db.collection("vehicles").find({ verified: true }).sort({ verifiedAt: -1 }).toArray(),
      db.collection("libraries").find({ verified: true }).sort({ verifiedAt: -1 }).toArray(),
      db.collection("services").find({ verified: true }).sort({ verifiedAt: -1 }).toArray()
    ]);

    res.json({ success: true, messes, rooms, vehicles, libraries, services });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
}

/* ---- Mess ---- */
async function approveMess(req, res) {
  try {
    const db = getDB();
    await db.collection("messes").updateOne(
      { _id: new ObjectId(req.params.id) },
      { $set: { status: "approved", verified: true, verifiedAt: new Date() } }
    );
    res.json({ success: true, message: "Mess approved and verified" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
}

async function unverifyMess(req, res) {
  try {
    const db = getDB();
    await db.collection("messes").updateOne(
      { _id: new ObjectId(req.params.id) },
      { $set: { status: "pending", verified: false }, $unset: { verifiedAt: "" } }
    );
    res.json({ success: true, message: "Mess verification removed" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
}

async function rejectMess(req, res) {
  try {
    const db = getDB();
    await db.collection("messes").deleteOne({ _id: new ObjectId(req.params.id) });
    res.json({ success: true, message: "Mess rejected" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
}

/* ---- Room ---- */
async function approveRoom(req, res) {
  try {
    const db = getDB();
    await db.collection("rooms").updateOne(
      { _id: new ObjectId(req.params.id) },
      { $set: { status: "approved", verified: true, verifiedAt: new Date() } }
    );
    res.json({ success: true, message: "Room approved and verified" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
}

async function unverifyRoom(req, res) {
  try {
    const db = getDB();
    await db.collection("rooms").updateOne(
      { _id: new ObjectId(req.params.id) },
      { $set: { status: "pending", verified: false }, $unset: { verifiedAt: "" } }
    );
    res.json({ success: true, message: "Room verification removed" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
}

async function rejectRoom(req, res) {
  try {
    const db = getDB();
    await db.collection("rooms").deleteOne({ _id: new ObjectId(req.params.id) });
    res.json({ success: true, message: "Room rejected" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
}

/* ---- Vehicle ---- */
async function approveVehicle(req, res) {
  try {
    const db = getDB();
    await db.collection("vehicles").updateOne(
      { _id: new ObjectId(req.params.id) },
      { $set: { status: "approved", verified: true, verifiedAt: new Date() } }
    );
    res.json({ success: true, message: "Vehicle approved and verified" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
}

async function unverifyVehicle(req, res) {
  try {
    const db = getDB();
    await db.collection("vehicles").updateOne(
      { _id: new ObjectId(req.params.id) },
      { $set: { status: "pending", verified: false }, $unset: { verifiedAt: "" } }
    );
    res.json({ success: true, message: "Vehicle verification removed" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
}

async function rejectVehicle(req, res) {
  try {
    const db = getDB();
    await db.collection("vehicles").deleteOne({ _id: new ObjectId(req.params.id) });
    res.json({ success: true, message: "Vehicle rejected" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
}

/* @route  GET /api/admin/users  (admin) */
async function getUsers(req, res) {
  try {
    const db = getDB();
    const users = await db
      .collection("users")
      .find({}, { projection: { password: 0 } })
      .sort({ createdAt: -1 })
      .toArray();

    res.json({ success: true, users });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
}

/* ---- Buy & Sell ---- */
async function approveItem(req, res) {
  try {
    const db = getDB();
    await db.collection("buysell").updateOne(
      { _id: new ObjectId(req.params.id) },
      { $set: { status: "approved" } }
    );
    res.json({ success: true, message: "Item published" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
}

async function rejectItem(req, res) {
  try {
    const db = getDB();
    await db.collection("buysell").deleteOne({ _id: new ObjectId(req.params.id) });
    res.json({ success: true, message: "Item rejected" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
}

/* @route  GET /api/admin/reports  (admin) — buy & sell reports for moderation */
async function getReports(req, res) {
  try {
    const db = getDB();
    const reports = await db
      .collection("buysellReports")
      .find({})
      .sort({ createdAt: -1 })
      .toArray();

    res.json({ success: true, reports });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
}

/* ---- Library ---- */
async function approveLibrary(req, res) {
  try {
    const db = getDB();
    await db.collection("libraries").updateOne(
      { _id: new ObjectId(req.params.id) },
      { $set: { status: "approved", verified: true, verifiedAt: new Date() } }
    );
    res.json({ success: true, message: "Library approved and verified" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
}

async function unverifyLibrary(req, res) {
  try {
    const db = getDB();
    await db.collection("libraries").updateOne(
      { _id: new ObjectId(req.params.id) },
      { $set: { status: "pending", verified: false }, $unset: { verifiedAt: "" } }
    );
    res.json({ success: true, message: "Library verification removed" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
}

async function rejectLibrary(req, res) {
  try {
    const db = getDB();
    await db.collection("libraries").deleteOne({ _id: new ObjectId(req.params.id) });
    res.json({ success: true, message: "Library rejected" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
}

/* ---- Daily Service ---- */
async function approveService(req, res) {
  try {
    const db = getDB();
    await db.collection("services").updateOne(
      { _id: new ObjectId(req.params.id) },
      { $set: { status: "approved", verified: true, verifiedAt: new Date() } }
    );
    res.json({ success: true, message: "Service approved and verified" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
}

async function unverifyService(req, res) {
  try {
    const db = getDB();
    await db.collection("services").updateOne(
      { _id: new ObjectId(req.params.id) },
      { $set: { status: "pending", verified: false }, $unset: { verifiedAt: "" } }
    );
    res.json({ success: true, message: "Service verification removed" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
}

async function rejectService(req, res) {
  try {
    const db = getDB();
    await db.collection("services").deleteOne({ _id: new ObjectId(req.params.id) });
    res.json({ success: true, message: "Service rejected" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
}

module.exports = {
  getPending, getVerified, getUsers,
  approveMess, rejectMess, unverifyMess,
  approveRoom, rejectRoom, unverifyRoom,
  approveVehicle, rejectVehicle, unverifyVehicle,
  approveLibrary, rejectLibrary, unverifyLibrary,
  approveService, rejectService, unverifyService,
  approveItem, rejectItem, getReports
};
