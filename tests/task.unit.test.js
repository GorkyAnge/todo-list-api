const { Task } = require("../models/task");
const {
  createTask,
  getTasks,
  updateTask,
  deleteTask,
} = require("../services/taskService");

// Mock del modelo Task
jest.mock("../models/task", () => ({
  Task: {
    create: jest.fn(),
    findAll: jest.fn(),
    findByPk: jest.fn(),
  },
}));

describe("Task Service - Unit Tests", () => {
  test("should create a task", async () => {
    const mockTask = {
      id: 1,
      title: "Test Task",
      description: "Test Description",
    };
    Task.create.mockResolvedValue(mockTask);

    const result = await createTask({
      title: "Test Task",
      description: "Test Description",
    });
    expect(Task.create).toHaveBeenCalledWith({
      title: "Test Task",
      description: "Test Description",
    });
    expect(result).toEqual(mockTask);
  });

  test("should retrieve all tasks", async () => {
    const mockTasks = [
      { id: 1, title: "Test Task", description: "Test Description" },
    ];
    Task.findAll.mockResolvedValue(mockTasks);

    const result = await getTasks();
    expect(Task.findAll).toHaveBeenCalled();
    expect(result).toEqual(mockTasks);
  });

  test("should update a task status", async () => {
    const mockTask = { id: 1, status: "pending", save: jest.fn() };
    Task.findByPk.mockResolvedValue(mockTask);

    const result = await updateTask(1, "completed");
    expect(Task.findByPk).toHaveBeenCalledWith(1);
    expect(mockTask.status).toBe("completed");
    expect(mockTask.save).toHaveBeenCalled();
    expect(result).toEqual(mockTask);
  });

  test("should delete a task", async () => {
    const mockTask = { id: 1, destroy: jest.fn() };
    Task.findByPk.mockResolvedValue(mockTask);

    const result = await deleteTask(1);
    expect(Task.findByPk).toHaveBeenCalledWith(1);
    expect(mockTask.destroy).toHaveBeenCalled();
    expect(result).toEqual({ message: "Task deleted" });
  });

  test("should return error if task not found for deletion", async () => {
    Task.findByPk.mockResolvedValue(null);

    await expect(deleteTask(1)).rejects.toThrow("Task not found");
    expect(Task.findByPk).toHaveBeenCalledWith(1);
  });
});
