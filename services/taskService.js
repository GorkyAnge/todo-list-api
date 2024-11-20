const { Task } = require("../models/task");

async function createTask(data) {
  return await Task.create(data);
}

async function getTasks() {
  return await Task.findAll();
}

async function updateTask(id, status) {
  const task = await Task.findByPk(id);
  if (!task) throw new Error("Task not found");
  task.status = status;
  await task.save();
  return task;
}

async function deleteTask(id) {
  const task = await Task.findByPk(id);
  if (!task) throw new Error("Task not found");
  await task.destroy();
  return { message: "Task deleted" };
}

module.exports = { createTask, getTasks, updateTask, deleteTask };
