import "dotenv/config";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import User from "../models/User.js";

const MONGO_URI =
  process.env.MONGO_URI || "mongodb://127.0.0.1:27017/timetable_db";

const seedAdmin = async () => {
  try {
    await mongoose.connect(MONGO_URI);

    const adminEmail = process.env.ADMIN_EMAIL || "admin@school.com";
    const adminPassword = process.env.ADMIN_PASSWORD || "password123";

    const hash = await bcrypt.hash(adminPassword, 10);

    await User.findOneAndUpdate(
      { email: adminEmail },
      {
        name: "System Admin",
        email: adminEmail,
        password_hash: hash,
        role: "admin",
      },
      { upsert: true, new: true }
    );

    console.log("✅ Admin user created / already exists");
    console.log(`📧 Email: ${adminEmail}`);
    console.log(`🔑 Password: ${adminPassword}`);

    process.exit(0);
  } catch (err) {
    console.error("❌ Failed to seed admin:", err);
    process.exit(1);
  }
};

seedAdmin();
