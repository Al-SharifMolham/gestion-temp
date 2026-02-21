import "dotenv/config";
import bcrypt from "bcryptjs";
import db from "../config/db.js";

const seedAdmin = async () => {
  try {
    const adminEmail =
      process.env.ADMIN_EMAIL || "admin@school.com";
    const adminPassword =
      process.env.ADMIN_PASSWORD || "password123";

    const hash = await bcrypt.hash(adminPassword, 10);

    const [result] = await db.query(
      `INSERT INTO users (name, email, password_hash, role)
       VALUES ('System Admin', ?, ?, 'admin')
       ON DUPLICATE KEY UPDATE id = id`,
      [adminEmail, hash]
    );

    if (result.affectedRows > 0) {
      console.log("✅ Admin user created / already exists");
      console.log(`📧 Email: ${adminEmail}`);
      console.log(`🔑 Password: ${adminPassword}`);
    }

    process.exit(0);
  } catch (err) {
    console.error("❌ Failed to seed admin:", err);
    process.exit(1);
  }
};

seedAdmin();
