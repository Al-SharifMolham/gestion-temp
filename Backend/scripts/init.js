import "dotenv/config";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import User from "../models/User.js";

const MONGO_URI =
  process.env.MONGO_URI || "mongodb://127.0.0.1:27017/timetable_db";

const init = async () => {
  console.log("🚀 Starting System Initialization...");

  try {
    await mongoose.connect(MONGO_URI);
    console.log("✅ Connected to MongoDB");

    const adminEmail = process.env.ADMIN_EMAIL || "alshrif.molhamali@gmail.com";
    const adminPass = process.env.ADMIN_PASSWORD || "Molham@2026";

    const hash = await bcrypt.hash(adminPass, 10);

    await User.findOneAndUpdate(
      { email: adminEmail },
      {
        name: "Molham Admin",
        email: adminEmail,
        password_hash: hash,
        role: "admin",
      },
      { upsert: true, new: true }
    );

    console.log("✅ Admin Account Configured:");
    console.log(`   📧 ${adminEmail}`);
    console.log(`   🔑 ${adminPass}`);

    process.exit(0);
  } catch (err) {
    console.error("❌ Initialization Failed:", err);
    process.exit(1);
  }
};

init();
