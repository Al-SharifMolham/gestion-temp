import mongoose from "mongoose";
import Session from "../models/Session.js";

const formatConflict = (reason) => ({ error: true, reason });

const getAllSessions = async (filters = {}) => {
  const query = {};

  if (filters.group_id) query.group_id = filters.group_id;
  if (filters.instructor_id) query.instructor_id = filters.instructor_id;
  if (filters.day_of_week) query.day_of_week = filters.day_of_week;

  const sessions = await Session.find(query)
    .populate("room_id", "name")
    .populate("subject_id", "name code")
    .populate("group_id", "name")
    .populate("instructor_id", "name")
    .sort({ day_of_week: 1, start_time: 1 })
    .lean();

  return sessions.map((s) => ({
    id: s._id,
    day_of_week: s.day_of_week,
    start_time: s.start_time,
    end_time: s.end_time,
    room_id: s.room_id?._id || null,
    room_name: s.room_id?.name || null,
    subject_id: s.subject_id?._id || null,
    subject_name: s.subject_id?.name || null,
    subject_code: s.subject_id?.code || null,
    group_id: s.group_id?._id || null,
    group_name: s.group_id?.name || null,
    instructor_id: s.instructor_id?._id || null,
    instructor_name: s.instructor_id?.name || null,
    status: s.status,
    notes: s.notes,
    createdAt: s.createdAt,
    updatedAt: s.updatedAt,
  }));
};

const checkConflicts = async (sessionData, excludeId = null) => {
  const { day_of_week, start_time, end_time, room_id, instructor_id, group_id } = sessionData;

  const baseFilter = {
    day_of_week,
    start_time: { $lt: end_time },
    end_time: { $gt: start_time },
  };

  if (excludeId) {
    baseFilter._id = { $ne: excludeId };
  }

  // Check conflicts in priority order: room, instructor, group
  const roomConflict = await Session.findOne({ ...baseFilter, room_id });
  if (roomConflict) return "Room Occupied";

  const instructorConflict = await Session.findOne({ ...baseFilter, instructor_id });
  if (instructorConflict) return "Instructor Busy";

  const groupConflict = await Session.findOne({ ...baseFilter, group_id });
  if (groupConflict) return "Group Busy";

  return null;
};

const createSession = async (sessionData) => {
  const session = await mongoose.startSession();
  try {
    session.startTransaction();

    const conflict = await checkConflicts(sessionData);
    if (conflict) {
      await session.abortTransaction();
      return formatConflict(conflict);
    }

    const finalStatus = sessionData.status || "active";
    const finalNotes = sessionData.notes ?? "";

    const [created] = await Session.create(
      [{ ...sessionData, status: finalStatus, notes: finalNotes }],
      { session }
    );

    await session.commitTransaction();
    return { id: created._id, ...sessionData, status: finalStatus, notes: finalNotes };
  } catch (err) {
    await session.abortTransaction();
    throw err;
  } finally {
    session.endSession();
  }
};

const updateSession = async (id, sessionData) => {
  const session = await mongoose.startSession();
  try {
    session.startTransaction();

    const conflict = await checkConflicts(sessionData, id);
    if (conflict) {
      await session.abortTransaction();
      return formatConflict(conflict);
    }

    const finalStatus = sessionData.status || "active";
    const finalNotes = sessionData.notes ?? "";

    await Session.findByIdAndUpdate(
      id,
      { ...sessionData, status: finalStatus, notes: finalNotes },
      { session }
    );

    await session.commitTransaction();
    return { id, ...sessionData, status: finalStatus, notes: finalNotes };
  } catch (err) {
    await session.abortTransaction();
    throw err;
  } finally {
    session.endSession();
  }
};

const patchSessionDetails = async (id, updates = {}) => {
  const fields = {};

  if (updates.status !== undefined) fields.status = updates.status;
  if (updates.notes !== undefined) fields.notes = updates.notes;

  if (Object.keys(fields).length === 0) return null;

  await Session.findByIdAndUpdate(id, fields);
  return { id, status: updates.status, notes: updates.notes };
};

const deleteSession = async (id) => {
  await Session.findByIdAndDelete(id);
};

const getSessionById = async (id) => {
  const s = await Session.findById(id).lean();
  if (!s) return null;
  s.id = s._id;
  delete s._id;
  delete s.__v;
  return s;
};

export default {
  getAllSessions,
  createSession,
  updateSession,
  patchSessionDetails,
  deleteSession,
  getSessionById,
};
