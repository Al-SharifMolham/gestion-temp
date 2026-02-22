import User from "../models/User.js";
import bcrypt from "bcryptjs";

const getAllUsers = async () => {
  const users = await User.find().populate("group_id", "name").lean();
  return users.map((u) => {
    const { password_hash, __v, _id, group_id, ...rest } = u;
    return {
      ...rest,
      id: _id,
      group_id: group_id?._id || null,
      group_name: group_id?.name || null,
    };
  });
};

const createUser = async (userData) => {
  const { name, email, password, role, group_id } = userData;

  if (!name || !email || !password || !role) {
    throw new Error("Missing required fields: name, email, password, role");
  }

  const password_hash = await bcrypt.hash(password, 10);

  const normalizedGroupId =
    group_id === undefined || group_id === "" ? null : group_id;

  const user = await User.create({
    name,
    email,
    password_hash,
    role,
    group_id: normalizedGroupId,
  });

  return { id: user._id, name, email, role, group_id: normalizedGroupId };
};

const updateUser = async (id, userData) => {
  const { name, email, password, role, group_id } = userData;

  const updates = {};

  if (name !== undefined) updates.name = name;
  if (email !== undefined) updates.email = email;
  if (role !== undefined) updates.role = role;
  if (group_id !== undefined) {
    updates.group_id = group_id === "" ? null : group_id;
  }
  if (password) {
    updates.password_hash = await bcrypt.hash(password, 10);
  }

  if (Object.keys(updates).length === 0) return null;

  await User.findByIdAndUpdate(id, updates);
  return { id, message: "Updated successfully" };
};

const deleteUser = async (id) => {
  await User.findByIdAndDelete(id);
};

export default { getAllUsers, createUser, updateUser, deleteUser };
