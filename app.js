const express = require("express");
const bodyParser = require("body-parser");
const { Task, sequelize } = require("./models/task");

const app = express();
app.use(bodyParser.json());

app.post("/tasks", async (req, res) => {
  const { title, description } = req.body;
  const task = await Task.create({ title, description });
  res.status(201).json(task);
});

app.get("/tasks", async (_, res) => {
  const tasks = await Task.findAll();
  res.json(tasks);
});

app.patch("/tasks/:id", async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  const task = await Task.findByPk(id);
  if (!task) return res.status(404).send("Task not found");
  task.status = status;
  await task.save();
  res.json(task);
});

app.delete("/tasks/:id", async (req, res) => {
  const { id } = req.params;
  const task = await Task.findByPk(id);
  if (!task) return res.status(404).send("Task not found");
  await task.destroy();
  res.send({ message: "Task deleted" });
});

module.exports = { app, sequelize };
