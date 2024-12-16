import TaskModel from "../models/taskModel.js";

export const createTask = async (req, res) => {
  try {
    const { userId } = req.body
    const { title, priority, status, startTime, endTime } = req.body;
    const task = await TaskModel.create({
      title,
      priority,
      status,
      startTime,
      endTime,
      userId
    });
    res.status(201).json({ success: true, message: "Task created successfully", task });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to create task", error: error.message });
  }
};

// Read all tasks
export const getTasks = async (req, res) => {
  try {
    const { userId } = req.body
    const tasks = await TaskModel.find({ userId });
    res.status(200).json({ success: true, tasks });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to fetch tasks", error: error.message });
  }
};


// Update a task
export const updateTask = async (req, res) => {
  try {
    const { userId } = req.body
    const { id } = req.params;
    const updatedData = req.body;
    const task = await TaskModel.findOneAndUpdate(
      { _id: id, userId },
      updatedData,
      { new: true }
    );
    if (!task) return res.status(404).json({ success: false, message: "Task not found" });
    res.status(200).json({ success: true, message: "Task updated successfully", task });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to update task", error: error.message });
  }
};

// Delete a task by ID
export const deleteTask = async (req, res) => {
  try {
    const { userId } = req.body
    const { id } = req.params;
    const task = await TaskModel.findOneAndDelete({ _id: id, userId });
    if (!task) return res.status(404).json({ success: false, message: "Task not found" });
    res.status(200).json({ success: true, message: "Task deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to delete task", error: error.message });
  }
};

// Delete multiple tasks by IDs
export const deleteTasksByIds = async (req, res) => {
  try {
    const { userId } = req.body
    const { ids } = req.body; // Array of IDs
    await TaskModel.deleteMany({ _id: { $in: ids }, userId });
    res.status(200).json({ success: true, message: "Tasks deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to delete tasks", error: error.message });
  }
};





// In taskController.js
export const dashboardSummary = async (req, res) => {
  try {
    const { userId } = req.body;
    if (!userId) {
      return res.status(400).json({ success: false, message: "User ID is required" });
    }
    const currentTime = new Date();

    // 1. Total count of tasks
    const totalTasks = await TaskModel.countDocuments({ userId });
    const completedTasks = await TaskModel.countDocuments({ status: "Completed", userId });
    const pendingTasks = await TaskModel.countDocuments({ status: "Pending", userId });
    const inProgressTasks = await TaskModel.countDocuments({ status: "In Progress", userId });

    // 2. Calculate percentages
    const completedPercentage = totalTasks ? ((completedTasks / totalTasks) * 100).toFixed(2) : 0;
    const pendingPercentage = totalTasks ? (((pendingTasks + inProgressTasks) / totalTasks) * 100).toFixed(2) : 0;

    // 3. Time analysis for pending tasks by priority
    const pendingTasksData = await TaskModel.find({
      userId,
      status: { $in: ["Pending", "In Progress"] }
    });

    const priorityTimeAnalysis = {
      High: { elapsed: 0, remaining: 0 },
      Medium: { elapsed: 0, remaining: 0 },
      Low: { elapsed: 0, remaining: 0 }
    };

    pendingTasksData.forEach(task => {
      const startTime = new Date(task.startTime);
      const endTime = new Date(task.endTime);

      // Calculate time elapsed (in hours)
      const elapsedMs = currentTime.getTime() - startTime.getTime();
      const elapsedHours = elapsedMs / (1000 * 60 * 60);

      // Calculate remaining time (in hours)
      let remainingHours = 0;
      if (currentTime < endTime) {
        const remainingMs = endTime.getTime() - currentTime.getTime();
        remainingHours = remainingMs / (1000 * 60 * 60);
      }

      priorityTimeAnalysis[task.priority].elapsed += elapsedHours;
      priorityTimeAnalysis[task.priority].remaining += remainingHours;
    });

    // 4. Calculate average completion time for completed tasks
    const completedTasksData = await TaskModel.find({
      userId,
      status: "Completed"
    });

    let totalCompletionTime = 0;
    completedTasksData.forEach(task => {
      const startTime = new Date(task.startTime);
      const endTime = new Date(task.endTime);
      const completionTimeMs = endTime.getTime() - startTime.getTime();
      const completionTimeHours = completionTimeMs / (1000 * 60 * 60);
      totalCompletionTime += completionTimeHours;
    });

    const averageCompletionTime = completedTasksData.length
      ? (totalCompletionTime / completedTasksData.length).toFixed(2)
      : 0;

    // Format numbers to 2 decimal places
    Object.keys(priorityTimeAnalysis).forEach(priority => {
      priorityTimeAnalysis[priority].elapsed = Number(priorityTimeAnalysis[priority].elapsed.toFixed(2));
      priorityTimeAnalysis[priority].remaining = Number(priorityTimeAnalysis[priority].remaining.toFixed(2));
    });

    res.status(200).json({
      success: true,
      summary: {
        taskCounts: {
          total: totalTasks,
          completed: completedTasks,
          pending: pendingTasks,
          inProgress: inProgressTasks
        },
        percentages: {
          completed: Number(completedPercentage),
          pending: Number(pendingPercentage)
        },
        timeAnalysisByPriority: priorityTimeAnalysis,
        averageCompletionTime: Number(averageCompletionTime)
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch dashboard summary",
      error: error.message
    });
  }
};

