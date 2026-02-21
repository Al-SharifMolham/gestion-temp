import express from "express";
import {
  getSessions,
  createSession,
  updateSession,
  patchSession,
  deleteSession,
} from "../controllers/sessionController.js";

import { authenticateJWT, authorizeRole } from "../middleware/auth.js";

const router = express.Router();

router.use(authenticateJWT);

router.get("/", getSessions);

// Modification routes
router.post("/", authorizeRole("admin"), createSession);
router.put("/:id", authorizeRole("admin"), updateSession);
router.patch("/:id/details", authorizeRole("admin", "instructor"), patchSession);
router.delete("/:id", authorizeRole("admin"), deleteSession);

export default router;
