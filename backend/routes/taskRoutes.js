import express from "express";
import tasks from "../data/tasks.js";
import multer from "multer";


const router = express.Router();
const storage = multer.diskStorage({
  destination: "uploads/",
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({ storage });

const validStatuses = ["pending", "completed"];
const validPriorities = ["low", "medium", "high"];
const requiredFields = ["title", "description", "status", "priority", "dueDate", "category"];

function getTaskId(value) {
  const id = Number(value);

  if (!Number.isInteger(id) || id < 1) {
    return null;
  }

  return id;
}

function validateTaskFields(task) {
  const missingFields = requiredFields.filter(
    (field) => typeof task[field] !== "string" || task[field].trim() === ""
  );

  if (missingFields.length > 0) {
    return `Missing required fields: ${missingFields.join(", ")}`;
  }

  if (!validStatuses.includes(task.status)) {
    return "status must be pending or completed";
  }

  if (!validPriorities.includes(task.priority)) {
    return "priority must be low, medium, or high";
  }

  return null;
}

router.get("/", (req, res) => {
  const totalTasks = tasks.length;
  const page = Number(req.query.page);
  const limit = Number(req.query.limit);
  const start = (page - 1) * limit;
  const totalPages = Math.ceil(totalTasks / limit);
  const slicedTasks = tasks.slice(start, start + limit);


  res.json({ tasks: slicedTasks, page, totalTasks, totalPages });
});

router.get("/dashboard", (req, res) => {
  const totalTasks = tasks.length;

  const completedTasks = tasks.filter(
    (task) => task.status === "completed"
  ).length;

  const pendingTasks = tasks.filter(
    (task) => task.status === "pending"
  ).length;

  res.json({
    totalTasks,
    completedTasks,
    pendingTasks,
  });
});

router.get("/:id", (req, res) => {
  const id = getTaskId(req.params.id);

  if (id === null) {
    return res.status(400).json({ error: "Task ID must be a positive integer" });
  }

  const task = tasks.find((item) => item.id === id);

  if (!task) {
    return res.status(404).json({ error: "Task not found" });
  }

  res.json(task);
});

router.post("/", (req, res) => {
  const validationError = validateTaskFields(req.body);

  if (validationError) {
    return res.status(400).json({ error: validationError });
  }

  const newTask = {
    id: tasks.length > 0 ? Math.max(...tasks.map((task) => task.id)) + 1 : 1,
    ...req.body,
  };

  tasks.push(newTask);
  res.status(201).json(newTask);
});

router.put("/:id", (req, res) => {
  const id = getTaskId(req.params.id);

  if (id === null) {
    return res.status(400).json({ error: "Task ID must be a positive integer" });
  }

  const taskIndex = tasks.findIndex((task) => task.id === id);

  if (taskIndex === -1) {
    return res.status(404).json({ error: "Task not found" });
  }

  const validationError = validateTaskFields(req.body);

  if (validationError) {
    return res.status(400).json({ error: validationError });
  }

  tasks[taskIndex] = { id, ...req.body };
  res.json(tasks[taskIndex]);
});

router.delete("/:id", (req, res) => {
  const id = getTaskId(req.params.id);

  if (id === null) {
    return res.status(400).json({ error: "Task ID must be a positive integer" });
  }

  const taskIndex = tasks.findIndex((task) => task.id === id);

  if (taskIndex === -1) {
    return res.status(404).json({ error: "Task not found" });
  }

  const [deletedTask] = tasks.splice(taskIndex, 1);
  res.json(deletedTask);
});

router.patch("/:id", (req, res) => {
  const id = getTaskId(req.params.id);

  if (id === null) {
    return res
      .status(400)
      .json({ error: "Task ID must be a positive integer" });
  }

  const task = tasks.find((item) => item.id === id);

  if (!task) {
    return res.status(404).json({ error: "Task not found" });
  }

  const validationError = validateTaskFields(req.body);

  if (validationError) {
    return res.status(400).json({ error: validationError });
  }

  task.title = req.body.title;
  task.description = req.body.description;
  task.status = req.body.status;
  task.priority = req.body.priority;
  task.dueDate = req.body.dueDate;
  task.category = req.body.category;

  res.json(task);
});

router.patch("/:id/status", (req, res) => {
  const id = getTaskId(req.params.id);

  if (id === null) {
    return res.status(400).json({ error: "Task ID must be a positive integer" });
  }

  if (!validStatuses.includes(req.body.status)) {
    return res.status(400).json({ error: "status must be pending or completed" });
  }

  const task = tasks.find((item) => item.id === id);

  if (!task) {
    return res.status(404).json({ error: "Task not found" });
  }

  task.status = req.body.status;
  res.json(task);
});

router.post("/profile/avatar", upload.single("image"), (req, res) => {


  res.json({
    message: "Avatar received",
    filename: req.file.filename,
  });
})



export default router;
