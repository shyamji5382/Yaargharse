/*
  Run this once to create (or promote) an admin user.
  Usage:
    node scripts/createAdmin.js "Admin Name" admin@example.com 9999999999 yourPassword
*/
const dns = require("dns");
dns.setServers(["8.8.8.8", "8.8.4.4"]);

require("dotenv").config();
const bcrypt = require("bcryptjs");
const { connectDB, getDB } = require("../config/db");

async function run() {
  const [name, email, phone, password] = process.argv.slice(2);

  if (!name || !email || !phone || !password) {
    console.log("Usage: node scripts/createAdmin.js \"Admin Name\" admin@example.com 9999999999 yourPassword");
    process.exit(1);
  }

  await connectDB();
  const db = getDB();
  const users = db.collection("users");

  const existing = await users.findOne({ email });

  if (existing) {
    await users.updateOne({ email }, { $set: { role: "admin" } });
    console.log(`✅ Existing user ${email} promoted to admin.`);
  } else {
    const hashedPassword = await bcrypt.hash(password, 10);
    await users.insertOne({
      name,
      email,
      phone,
      password: hashedPassword,
      role: "admin",
      createdAt: new Date()
    });
    console.log(`✅ Admin user ${email} created.`);
  }

  process.exit(0);
}

run().catch(err => {
  console.error("❌ Failed:", err.message);
  process.exit(1);
});
