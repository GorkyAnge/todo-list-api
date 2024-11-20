const request = require("supertest");
const { app, sequelize } = require("../app");

beforeAll(async () => {
  // Sincronizar la base de datos antes de las pruebas
  await sequelize.sync({ force: true });
});

afterAll(async () => {
  // Cerrar la conexión después de las pruebas
  await sequelize.close();
});

describe("Integration Tests for Task API", () => {
  let createdTaskId;

  test("POST /tasks - Create a task", async () => {
    const response = await request(app).post("/tasks").send({
      title: "Integration Test Task",
      description: "This task is for integration testing",
    });

    expect(response.statusCode).toBe(201);
    expect(response.body).toHaveProperty("id");
    expect(response.body.title).toBe("Integration Test Task");

    createdTaskId = response.body.id; // Guardar ID para las siguientes pruebas
  });

  test("GET /tasks - List all tasks", async () => {
    const response = await request(app).get("/tasks");

    expect(response.statusCode).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body.length).toBeGreaterThan(0);

    const task = response.body.find((t) => t.id === createdTaskId);
    expect(task).toBeDefined();
    expect(task.title).toBe("Integration Test Task");
  });

  test("PATCH /tasks/:id - Update a task status", async () => {
    const response = await request(app)
      .patch(`/tasks/${createdTaskId}`)
      .send({ status: "completed" });

    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty("status", "completed");
  });

  test("DELETE /tasks/:id - Delete a task", async () => {
    const response = await request(app).delete(`/tasks/${createdTaskId}`);

    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty("message", "Task deleted");
  });

  test("GET /tasks - Ensure task is deleted", async () => {
    const response = await request(app).get("/tasks");

    expect(response.statusCode).toBe(200);
    const task = response.body.find((t) => t.id === createdTaskId);
    expect(task).toBeUndefined(); // Asegúrate de que fue eliminado
  });
});
