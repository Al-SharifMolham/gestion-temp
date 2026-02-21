import resourceService from "../services/resourceService.js";

// Groups
export const getGroups = async (req, res) => res.json(await resourceService.getAllGroups());
export const createGroup = async (req, res) => {
  await resourceService.createGroup(req.body.name);
  res.status(201).json({ message: "Group created" });
};
export const deleteGroup = async (req, res) => {
  await resourceService.deleteGroup(req.params.id);
  res.json({ message: "Group deleted" });
};

// Rooms
export const getRooms = async (req, res) => res.json(await resourceService.getAllRooms());
export const createRoom = async (req, res) => {
  await resourceService.createRoom(req.body.name, req.body.capacity);
  res.status(201).json({ message: "Room created" });
};
export const deleteRoom = async (req, res) => {
  await resourceService.deleteRoom(req.params.id);
  res.json({ message: "Room deleted" });
};

// Subjects
export const getSubjects = async (req, res) => res.json(await resourceService.getAllSubjects());
export const createSubject = async (req, res) => {
  await resourceService.createSubject(req.body.name, req.body.code);
  res.status(201).json({ message: "Subject created" });
};
export const deleteSubject = async (req, res) => {
  await resourceService.deleteSubject(req.params.id);
  res.json({ message: "Subject deleted" });
};
