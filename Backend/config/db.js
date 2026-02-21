import "dotenv/config";
import mysql from "mysql2/promise";

const isDocker = process.env.DB_HOST === "db"; // أو خليه متغير ENV

const pool = mysql.createPool({
  host: process.env.DB_HOST || "127.0.0.1",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "",
  database: process.env.DB_NAME || "timetable_db",
  waitForConnections: true,
  connectionLimit: 10,
});

export default pool;
