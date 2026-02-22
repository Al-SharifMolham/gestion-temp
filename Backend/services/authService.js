import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const getJwtSecret = () => {
  const secret = process.env.JWT_SECRET;
  if (!secret) throw new Error("JWT_SECRET is not configured");
  return secret;
};

const login = async (email, password) => {
  const cleanEmail = String(email).trim().toLowerCase();
  const cleanPassword = String(password);

  const user = await User.findOne({ email: cleanEmail }).select("+password_hash").lean();
  if (!user) throw new Error("Invalid credentials");

  const isMatch = await bcrypt.compare(cleanPassword, user.password_hash);
  if (!isMatch) throw new Error("Invalid credentials");

  const token = jwt.sign(
    { id: user._id, role: user.role, group_id: user.group_id },
    getJwtSecret(),
    { expiresIn: "24h" }
  );

  const { password_hash, __v, ...safe } = user;
  safe.id = safe._id;
  delete safe._id;

  return { token, user: safe };
};

const getUserById = async (id) => {
  const user = await User.findById(id).select("name email role group_id").lean();
  if (!user) return null;
  user.id = user._id;
  delete user._id;
  return user;
};

export default { login, getUserById };
