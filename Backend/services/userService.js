import db from "../config/db.js";
import bcrypt from "bcryptjs";

const getAllUsers = async () => {
  const [rows] = await db.query(`
    SELECT u.id, u.name, u.email, u.role, u.group_id, g.name AS group_name
    FROM users u
    LEFT JOIN \`groups\` g ON u.group_id = g.id
  `);
  return rows;
};

const createUser = async (userData) => {
  const { name, email, password, role, group_id } = userData;

  if (!name || !email || !password || !role) {
    throw new Error("Missing required fields: name, email, password, role");
  }

  const password_hash = await bcrypt.hash(password, 10);

  const normalizedGroupId =
    group_id === undefined || group_id === "" ? null : group_id;

  const [result] = await db.query(
    "INSERT INTO users (name, email, password_hash, role, group_id) VALUES (?, ?, ?, ?, ?)",
    [name, email, password_hash, role, normalizedGroupId]
  );

  // NEVER return password or password_hash
  return { id: result.insertId, name, email, role, group_id: normalizedGroupId };
};

const updateUser = async (id, userData) => {
  const { name, email, password, role, group_id } = userData;

  const updates = [];
  const values = [];

  if (name !== undefined) {
    updates.push("name = ?");
    values.push(name);
  }
  if (email !== undefined) {
    updates.push("email = ?");
    values.push(email);
  }
  if (role !== undefined) {
    updates.push("role = ?");
    values.push(role);
  }
  if (group_id !== undefined) {
    const normalizedGroupId = group_id === "" ? null : group_id;
    updates.push("group_id = ?");
    values.push(normalizedGroupId);
  }

  if (password) {
    const hash = await bcrypt.hash(password, 10);
    updates.push("password_hash = ?");
    values.push(hash);
  }

  if (updates.length === 0) return null;

  values.push(id);
  await db.query(`UPDATE users SET ${updates.join(", ")} WHERE id = ?`, values);

  return { id, message: "Updated successfully" };
};

const deleteUser = async (id) => {
  await db.query("DELETE FROM users WHERE id = ?", [id]);
};

export default { getAllUsers, createUser, updateUser, deleteUser };
