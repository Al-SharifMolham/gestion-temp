import userService from "../services/userService.js";

export const getAllUsers = async (req, res) => {
  try {
    const users = await userService.getAllUsers();
    return res.json(users);
  } catch (err) {
    console.error("getAllUsers:", err);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export const createUser = async (req, res) => {
  try {
    const user = await userService.createUser(req.body);

    // remove password hash from response
    const { password_hash, ...safeUser } = user ?? {};
    return res.status(201).json(safeUser);
  } catch (err) {
    if (err?.code === "ER_DUP_ENTRY") {
      return res.status(409).json({ message: "Email already exists" });
    }
    console.error("createUser:", err);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export const updateUser = async (req, res) => {
  try {
    await userService.updateUser(req.params.id, req.body);
    return res.json({ message: "User updated" });
  } catch (err) {
    console.error("updateUser:", err);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export const deleteUser = async (req, res) => {
  try {
    await userService.deleteUser(req.params.id);
    return res.json({ message: "User deleted" });
  } catch (err) {
    console.error("deleteUser:", err);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};
