import express from "express";
import {
  getAllUsers,
  createUser,
  updateUser,
  deleteUser,
} from "../controllers/userController.js";

import { authenticateJWT, authorizeRole } from "../middleware/auth.js";

const router = express.Router();

// All routes require Admin role
router.use(authenticateJWT, authorizeRole("admin"));

router.get("/", getAllUsers);
router.post("/", createUser);
router.put("/:id", updateUser);
router.delete("/:id", deleteUser);

export default router;
