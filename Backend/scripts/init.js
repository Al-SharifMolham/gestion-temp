import "dotenv/config";
import mysql from "mysql2/promise";
import fs from "fs";
import path from "path";
import bcrypt from "bcryptjs";
import { fileURLToPath } from "url";

// Fix __dirname in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const init = async () => {
  console.log("🚀 Starting System Initialization...");

  const dbConfig = {
    host: process.env.DB_HOST || "db",       // Docker: db ; Local: 127.0.0.1
    user: process.env.DB_USER || "appuser",
    password: process.env.DB_PASSWORD || "apppass",
    multipleStatements: true,
  };

  let connection;

  try {
    connection = await mysql.createConnection(dbConfig);
    console.log("✅ Connected to MySQL Server");

    const dbName = process.env.DB_NAME || "timetable_db";
    await connection.query(`CREATE DATABASE IF NOT EXISTS \`${dbName}\``);
    await connection.query(`USE \`${dbName}\``);
    console.log(`✅ Database '${dbName}' selected`);

    // schema.sql path: ../database/schema.sql relative to scripts/
    const schemaPath = path.join(__dirname, "../database/schema.sql");
    const schemaSql = fs.readFileSync(schemaPath, "utf8");
    await connection.query(schemaSql);
    console.log("✅ Database Schema applied");

    // Admin credentials (better: put in .env, but keeping your choice)
    const adminEmail = process.env.ADMIN_EMAIL || "alshrif.molhamali@gmail.com";
    const adminPass = process.env.ADMIN_PASSWORD || "Molham@2026";

    const hash = await bcrypt.hash(adminPass, 10);

    await connection.query(
      `INSERT INTO users (name, email, password_hash, role)
       VALUES ('Molham Admin', ?, ?, 'admin')
       ON DUPLICATE KEY UPDATE
         password_hash = VALUES(password_hash),
         name = VALUES(name),
         role = 'admin'`,
      [adminEmail, hash]
    );

    console.log("✅ Admin Account Configured:");
    console.log(`   📧 ${adminEmail}`);
    console.log(`   🔑 ${adminPass}`);

    process.exit(0);
  } catch (err) {
    console.error("❌ Initialization Failed:", err);
    process.exit(1);
  } finally {
    if (connection) await connection.end();
  }
};

init();
