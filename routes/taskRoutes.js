import express from "express";
import {
  createTask,
  getTasks,
  updateTask,
  deleteTask,
  deleteTasksByIds,
  dashboardSummary,

} from "../controllers/taskController.js";
import userAuth from "../middleware/userAuth.js";

const taskRouter = express.Router();

taskRouter.post("/", userAuth, createTask);
taskRouter.get("/", userAuth, getTasks);
taskRouter.put("/:id", userAuth, updateTask);
taskRouter.delete("/:id", userAuth, deleteTask);
taskRouter.post("/delete-selected", userAuth, deleteTasksByIds);
taskRouter.post("/dashboard", userAuth, dashboardSummary);

export default taskRouter;