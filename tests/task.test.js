const request = require("supertest");
const { app, sequelize } = require("../app");
const { Task } = require("../models/task");

beforeAll(async () => {
  await sequelize.sync({ force: true });
});

afterAll(async () => {
  await sequelize.close();
});

test("should create a task", async () => {
  const res = await request(app)
    .post("/tasks")
    .send({ title: "Test Task", description: "Test Description" });
  expect(res.statusCode).toBe(201);
  expect(res.body.title).toBe("Test Task");
});

test("should list tasks", async () => {
  await Task.create({ title: "Test Task", description: "Test Description" });
  const res = await request(app).get("/tasks");
  expect(res.statusCode).toBe(200);
  expect(res.body.length).toBeGreaterThan(0);
});
