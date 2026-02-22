import Group from "../models/Group.js";
import Room from "../models/Room.js";
import Subject from "../models/Subject.js";

// Groups
const getAllGroups = async () => {
  return Group.find().lean().then((rows) =>
    rows.map(({ _id, __v, ...rest }) => ({ id: _id, ...rest }))
  );
};

const createGroup = async (name) => {
  const group = await Group.create({ name });
  return { id: group._id };
};

const deleteGroup = async (id) => {
  await Group.findByIdAndDelete(id);
};

// Rooms
const getAllRooms = async () => {
  return Room.find().lean().then((rows) =>
    rows.map(({ _id, __v, ...rest }) => ({ id: _id, ...rest }))
  );
};

const createRoom = async (name, capacity) => {
  const room = await Room.create({ name, capacity });
  return { id: room._id };
};

const deleteRoom = async (id) => {
  await Room.findByIdAndDelete(id);
};

// Subjects
const getAllSubjects = async () => {
  return Subject.find().lean().then((rows) =>
    rows.map(({ _id, __v, ...rest }) => ({ id: _id, ...rest }))
  );
};

const createSubject = async (name, code) => {
  const subject = await Subject.create({ name, code });
  return { id: subject._id };
};

const deleteSubject = async (id) => {
  await Subject.findByIdAndDelete(id);
};

export default {
  getAllGroups, createGroup, deleteGroup,
  getAllRooms, createRoom, deleteRoom,
  getAllSubjects, createSubject, deleteSubject,
};
