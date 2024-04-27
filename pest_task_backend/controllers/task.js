const taskRouter = require("express").Router();
const Task = require("../models/tasks");
const { userExtractor } = require("../utils/middleware");

taskRouter.get("/:id", async (req, res, next) => {
  try {
    const task = await Task.find({ user: req.params.id });
    if (task) res.json(task);
    else res.status(404).end();
  } catch (exception) {
    next(exception);
  }
});

taskRouter.post("/", userExtractor, async (req, res, next) => {
  const { title, description, status, dueDate, reminder, priority } = req.body;

  if (!title || !status)
    return res.status(400).json({ error: "Title ans url are required" });

  try {
    const user = req.user;
    const task = new Task({
      title,
      description,
      status,
      dueDate,
      reminder,
      priority,
      user: user,
    });

    const savedTask = await task.save();
    user.task = user.task.concat(savedTask._id);
    await user.save();
    res.status(201).json(savedTask);
  } catch (exception) {
    next(exception);
  }
});

taskRouter.delete("/:id", userExtractor, async (req, res, next) => {
  try {
    const taskToDelete = await Task.findById(req.params.id);

    if (!taskToDelete) return res.status(404).json({ error: "Task not found" });

    if (taskToDelete.user.toString() !== req.user._id.toString())
      return res.status(401).json({ error: "Unauthorized deletion" });

    const result = await Task.deleteOne(taskToDelete);

    if (result.deletedCount === 1) res.status(204).end();
    else res.status(400).json({ error: "Task deletion failed" });
  } catch (exception) {
    next(exception);
  }
});

taskRouter.put("/:id", userExtractor, async (req, res, next) => {
  const { title, description, status, dueDate, reminder, priority } = req.body;

  try {
    const user = req.user;
    const updateTask = await Task.findByIdAndUpdate(
      req.params.id,
      {
        title,
        description,
        status,
        dueDate,
        reminder,
        priority,
        user: user,
      },
      {
        new: true,
        runValidators: true,
        context: "query",
        populate: "user",
      }
    );

    if (!updateTask) {
      return res.status(404).json({ error: "Task not found" });
    }
    res.status(200).json(updateTask);
  } catch (exception) {
    next(exception);
  }
});

module.exports = taskRouter;
