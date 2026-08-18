const express = require("express");
const cors = require("cors");
const path = require("path");
require("dotenv").config();

// Fix for college/ISP WiFi blocking MongoDB Atlas SRV DNS lookups
const dns = require("dns");
dns.setServers(["8.8.8.8", "8.8.4.4"]);

const { connectDB, getDB } = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const messRoutes = require("./routes/messRoutes");
const roomRoutes = require("./routes/roomRoutes");
const vehicleRoutes = require("./routes/vehicleRoutes");
const vehicleBookingRoutes = require("./routes/vehicleBookingRoutes");
const buySellRoutes = require("./routes/buySellRoutes");
const libraryRoutes = require("./routes/libraryRoutes");
const serviceRoutes = require("./routes/serviceRoutes");
const studentHelpRoutes = require("./routes/studentHelpRoutes");
const reviewRoutes = require("./routes/reviewRoutes");
const adminRoutes = require("./routes/adminRoutes");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, "..", "frontend")));
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.use("/api", authRoutes);
app.use("/api/messes", messRoutes);
app.use("/api/rooms", roomRoutes);
app.use("/api/vehicles", vehicleRoutes);
app.use("/api/vehicle-bookings", vehicleBookingRoutes);
app.use("/api/buysell", buySellRoutes);
app.use("/api/libraries", libraryRoutes);
app.use("/api/services", serviceRoutes);
app.use("/api/student-help", studentHelpRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/api/admin", adminRoutes);

/* Health check */
app.get("/api/health", async (req, res) => {
  res.json({
    success: true,
    message: "YaarGharse API is running",
    database: "connected"
  });
});

/* Student enquiry */
app.post("/api/enquiries", async (req, res) => {
  try {
    const db = getDB();
    const enquiry = {
      ...req.body,
      status: "pending",
      createdAt: new Date()
    };

    const result = await db
      .collection("enquiries")
      .insertOne(enquiry);

    res.status(201).json({
      success: true,
      message: "Enquiry submitted",
      id: result.insertedId
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`🚀 YaarGharse running at http://localhost:${PORT}`);
  });
});