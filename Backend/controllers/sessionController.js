import sessionService from "../services/sessionService.js";

export const getSessions = async (req, res) => {
  try {
    const role = req.user?.role;
    const userId = req.user?.id;
    const groupId = req.user?.group_id;

    const filters = { ...(req.query ?? {}) };

    if (role === "student") {
      if (!groupId) return res.json([]);
      filters.group_id = groupId; // forced
    } else if (role === "instructor") {
      filters.instructor_id = userId; // forced
    }
    // admin: free filters

    const sessions = await sessionService.getAllSessions(filters);
    return res.json(sessions);
  } catch (err) {
    console.error("getSessions:", err);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export const createSession = async (req, res) => {
  try {
    const result = await sessionService.createSession(req.body);
    if (result?.error) return res.status(409).json({ message: result.reason });
    return res.status(201).json(result);
  } catch (err) {
    console.error("createSession:", err);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export const updateSession = async (req, res) => {
  try {
    const result = await sessionService.updateSession(req.params.id, req.body);
    if (result?.error) return res.status(409).json({ message: result.reason });
    return res.json(result);
  } catch (err) {
    console.error("updateSession:", err);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export const patchSession = async (req, res) => {
  try {
    const role = req.user?.role;
    const updates = req.body ?? {};
    const allowedUpdates = {};

    const forbiddenFields = [
      "start_time", "end_time", "day_of_week",
      "room_id", "instructor_id", "group_id", "subject_id",
    ];

    const hasForbidden = Object.keys(updates).some((k) => forbiddenFields.includes(k));
    if (hasForbidden) {
      return res.status(403).json({ message: "Forbidden: Cannot update schedule details via PATCH" });
    }

    if (role === "admin") {
      if ("status" in updates) allowedUpdates.status = updates.status;
      if ("notes" in updates) allowedUpdates.notes = updates.notes;
    } else if (role === "instructor") {
      const session = await sessionService.getSessionById(req.params.id);
      if (!session) return res.status(404).json({ message: "Session not found" });
      if (session.instructor_id !== req.user.id) {
        return res.status(403).json({ message: "Unauthorized: Not your session" });
      }
      if ("notes" in updates) allowedUpdates.notes = updates.notes;
    } else {
      return res.status(403).json({ message: "Forbidden" });
    }

    if (Object.keys(allowedUpdates).length === 0 && Object.keys(updates).length > 0) {
      return res.status(400).json({ message: "No valid fields to update" });
    }

    await sessionService.patchSessionDetails(req.params.id, allowedUpdates);
    return res.json({ message: "Session details updated", updates: allowedUpdates });
  } catch (err) {
    console.error("patchSession:", err);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export const deleteSession = async (req, res) => {
  try {
    await sessionService.deleteSession(req.params.id);
    return res.json({ message: "Session deleted" });
  } catch (err) {
    console.error("deleteSession:", err);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};
