import express from "express";
import cors from "cors";
import helmet from "helmet";

import authRoutes from "../routes/auth.js";
import userRoutes from "../routes/users.js";
import sessionRoutes from "../routes/sessions.js";
import resourceRoutes from "../routes/resources.js";

const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json());

app.get("/health", (req, res) => {
  res.json({ ok: true, message: "API is running" });
});

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/sessions", sessionRoutes);
app.use("/api/resources", resourceRoutes);

app.use((req, res) => res.status(404).json({ message: "Endpoint not found" }));

export default app;
