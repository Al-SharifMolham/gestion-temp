import db from "../config/db.js";

const formatConflict = (reason) => ({ error: true, reason });

const getAllSessions = async (filters = {}) => {
  let query = `
    SELECT s.*,
           r.name  AS room_name,
           sub.name AS subject_name, sub.code AS subject_code,
           g.name  AS group_name,
           u.name  AS instructor_name
    FROM sessions s
    JOIN rooms r ON s.room_id = r.id
    JOIN subjects sub ON s.subject_id = sub.id
    JOIN \`groups\` g ON s.group_id = g.id
    JOIN users u ON s.instructor_id = u.id
    WHERE 1=1
  `;

  const params = [];

  if (filters.group_id) {
    query += " AND s.group_id = ?";
    params.push(filters.group_id);
  }
  if (filters.instructor_id) {
    query += " AND s.instructor_id = ?";
    params.push(filters.instructor_id);
  }
  if (filters.day_of_week) {
    query += " AND s.day_of_week = ?";
    params.push(filters.day_of_week);
  }

  query += " ORDER BY s.day_of_week, s.start_time";

  const [rows] = await db.query(query, params);
  return rows;
};

const createSession = async (sessionData) => {
  const connection = await db.getConnection();
  try {
    await connection.query("SET TRANSACTION ISOLATION LEVEL SERIALIZABLE");
    await connection.beginTransaction();

    const {
      day_of_week,
      start_time,
      end_time,
      room_id,
      instructor_id,
      group_id,
      subject_id,
      status,
      notes,
    } = sessionData;

    const collisionQuery = `
      SELECT
        CASE
          WHEN room_id = ? THEN 'Room Occupied'
          WHEN instructor_id = ? THEN 'Instructor Busy'
          WHEN group_id = ? THEN 'Group Busy'
        END AS conflict_reason
      FROM sessions
      WHERE day_of_week = ?
        AND (start_time < ? AND end_time > ?)
        AND (room_id = ? OR instructor_id = ? OR group_id = ?)
      ORDER BY
        CASE
          WHEN room_id = ? THEN 1
          WHEN instructor_id = ? THEN 2
          WHEN group_id = ? THEN 3
        END
      LIMIT 1;
    `;

    const collisionParams = [
      room_id, instructor_id, group_id,
      day_of_week, end_time, start_time,
      room_id, instructor_id, group_id,
      room_id, instructor_id, group_id,
    ];

    const [collisions] = await connection.query(collisionQuery, collisionParams);
    if (collisions.length > 0) {
      await connection.rollback();
      return formatConflict(collisions[0].conflict_reason);
    }

    const finalStatus = status || "active";
    const finalNotes = notes ?? "";

    const [result] = await connection.query(
      `INSERT INTO sessions
        (day_of_week, start_time, end_time, room_id, subject_id, group_id, instructor_id, status, notes)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [day_of_week, start_time, end_time, room_id, subject_id, group_id, instructor_id, finalStatus, finalNotes]
    );

    await connection.commit();
    return { id: result.insertId, ...sessionData, status: finalStatus, notes: finalNotes };
  } catch (err) {
    await connection.rollback();
    throw err;
  } finally {
    connection.release();
  }
};

const updateSession = async (id, sessionData) => {
  const connection = await db.getConnection();
  try {
    await connection.query("SET TRANSACTION ISOLATION LEVEL SERIALIZABLE");
    await connection.beginTransaction();

    const {
      day_of_week,
      start_time,
      end_time,
      room_id,
      instructor_id,
      group_id,
      subject_id,
      status,
      notes,
    } = sessionData;

    const collisionQuery = `
      SELECT
        CASE
          WHEN room_id = ? THEN 'Room Occupied'
          WHEN instructor_id = ? THEN 'Instructor Busy'
          WHEN group_id = ? THEN 'Group Busy'
        END AS conflict_reason
      FROM sessions
      WHERE day_of_week = ?
        AND (start_time < ? AND end_time > ?)
        AND (room_id = ? OR instructor_id = ? OR group_id = ?)
        AND id != ?
      ORDER BY
        CASE
          WHEN room_id = ? THEN 1
          WHEN instructor_id = ? THEN 2
          WHEN group_id = ? THEN 3
        END
      LIMIT 1;
    `;

    const collisionParams = [
      room_id, instructor_id, group_id,
      day_of_week, end_time, start_time,
      room_id, instructor_id, group_id,
      id,
      room_id, instructor_id, group_id,
    ];

    const [collisions] = await connection.query(collisionQuery, collisionParams);
    if (collisions.length > 0) {
      await connection.rollback();
      return formatConflict(collisions[0].conflict_reason);
    }

    const finalStatus = status || "active";
    const finalNotes = notes ?? "";

    await connection.query(
      `UPDATE sessions
       SET day_of_week=?, start_time=?, end_time=?, room_id=?, subject_id=?, group_id=?, instructor_id=?, status=?, notes=?
       WHERE id=?`,
      [day_of_week, start_time, end_time, room_id, subject_id, group_id, instructor_id, finalStatus, finalNotes, id]
    );

    await connection.commit();
    return { id, ...sessionData, status: finalStatus, notes: finalNotes };
  } catch (err) {
    await connection.rollback();
    throw err;
  } finally {
    connection.release();
  }
};

const patchSessionDetails = async (id, updates = {}) => {
  const updateFields = [];
  const values = [];

  if (updates.status !== undefined) {
    updateFields.push("status = ?");
    values.push(updates.status);
  }
  if (updates.notes !== undefined) {
    updateFields.push("notes = ?");
    values.push(updates.notes);
  }

  if (updateFields.length === 0) return null;

  values.push(id);
  await db.query(`UPDATE sessions SET ${updateFields.join(", ")} WHERE id = ?`, values);
  return { id, status: updates.status, notes: updates.notes };
};

const deleteSession = async (id) => {
  await db.query("DELETE FROM sessions WHERE id = ?", [id]);
};

const getSessionById = async (id) => {
  const [rows] = await db.query("SELECT * FROM sessions WHERE id = ?", [id]);
  return rows?.[0] ?? null;
};

export default {
  getAllSessions,
  createSession,
  updateSession,
  patchSessionDetails,
  deleteSession,
  getSessionById,
};
