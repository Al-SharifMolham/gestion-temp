import express from "express";
import {
  getGroups,
  createGroup,
  deleteGroup,
  getRooms,
  createRoom,
  deleteRoom,
  getSubjects,
  createSubject,
  deleteSubject,
} from "../controllers/resourceController.js";

import { authenticateJWT, authorizeRole } from "../middleware/auth.js";

const router = express.Router();

// All resource routes restricted to Admin
router.use(authenticateJWT, authorizeRole("admin"));

// Groups
router.get("/groups", getGroups);
router.post("/groups", createGroup);
router.delete("/groups/:id", deleteGroup);

// Rooms
router.get("/rooms", getRooms);
router.post("/rooms", createRoom);
router.delete("/rooms/:id", deleteRoom);

// Subjects
router.get("/subjects", getSubjects);
router.post("/subjects", createSubject);
router.delete("/subjects/:id", deleteSubject);

export default router;
