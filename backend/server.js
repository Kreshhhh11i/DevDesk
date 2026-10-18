import "dotenv/config";

import express from "express";
import cors from "cors";
import taskRoutes from "./routes/taskRoutes.js";
import teamRoutes from "./routes/teamRoutes.js";

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.get("/api/health", (req, res) => {
  res.json({ message: "DevDesk API is running" });
});

app.use("/api/tasks", taskRoutes);
app.use("/api/team", teamRoutes);
app.use("/uploads", express.static("uploads"));

app.use((req, res) => {
  res.status(404).json({ error: "Route not found" });
});

app.use((error, req, res, next) => {
  if (error instanceof SyntaxError && error.status === 400 && "body" in error) {
    return res.status(400).json({ error: "Request body must contain valid JSON" });
  }

  res.status(500).json({ error: "Something went wrong on the server" });
});

app.listen(port, () => {
  console.log(`DevDesk API listening on http://localhost:${port}`);
});
