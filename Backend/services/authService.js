import db from "../config/db.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const getJwtSecret = () => {
  const secret = process.env.JWT_SECRET;
  if (!secret) throw new Error("JWT_SECRET is not configured");
  return secret;
};

const sanitizeUser = (user) => {
  if (!user) return null;
  // never leak password hash
  // eslint-disable-next-line no-unused-vars
  const { password_hash, ...safe } = user;
  return safe;
};

const login = async (email, password) => {
  const cleanEmail = String(email).trim().toLowerCase();
  const cleanPassword = String(password);

  const [rows] = await db.query("SELECT * FROM users WHERE email = ?", [cleanEmail]);
  const user = rows?.[0];

  if (!user) throw new Error("Invalid credentials");

  const isMatch = await bcrypt.compare(cleanPassword, user.password_hash);
  if (!isMatch) throw new Error("Invalid credentials");

  const token = jwt.sign(
    { id: user.id, role: user.role, group_id: user.group_id },
    getJwtSecret(),
    { expiresIn: "24h" }
  );

  return { token, user: sanitizeUser(user) };
};


const getUserById = async (id) => {
  const [rows] = await db.query(
    "SELECT id, name, email, role, group_id FROM users WHERE id = ?",
    [id]
  );
  return rows?.[0] ?? null;
};

export default { login, getUserById };
