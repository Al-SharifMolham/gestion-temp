import db from "../config/db.js";

// Groups
const getAllGroups = async () => {
  const [rows] = await db.query("SELECT * FROM `groups`");
  return rows;
};

const createGroup = async (name) => {
  const [result] = await db.query("INSERT INTO `groups` (`name`) VALUES (?)", [name]);
  return { id: result.insertId };
};

const deleteGroup = async (id) => {
  await db.query("DELETE FROM `groups` WHERE `id` = ?", [id]);
};

// Rooms
const getAllRooms = async () => {
  const [rows] = await db.query("SELECT * FROM `rooms`");
  return rows;
};

const createRoom = async (name, capacity) => {
  const [result] = await db.query(
    "INSERT INTO `rooms` (`name`, `capacity`) VALUES (?, ?)",
    [name, capacity]
  );
  return { id: result.insertId };
};

const deleteRoom = async (id) => {
  await db.query("DELETE FROM `rooms` WHERE `id` = ?", [id]);
};

// Subjects
const getAllSubjects = async () => {
  const [rows] = await db.query("SELECT * FROM `subjects`");
  return rows;
};

const createSubject = async (name, code) => {
  const [result] = await db.query(
    "INSERT INTO `subjects` (`name`, `code`) VALUES (?, ?)",
    [name, code]
  );
  return { id: result.insertId };
};

const deleteSubject = async (id) => {
  await db.query("DELETE FROM `subjects` WHERE `id` = ?", [id]);
};

export default {
  // groups
  getAllGroups,
  createGroup,
  deleteGroup,
  // rooms
  getAllRooms,
  createRoom,
  deleteRoom,
  // subjects
  getAllSubjects,
  createSubject,
  deleteSubject,
};
