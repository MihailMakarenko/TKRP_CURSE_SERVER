const Task = require("../models/task");
const Location = require("../models/location");

class TaskService {
  async addTask(data) {
    return await Task.create(data);
  }

  async getAllTasks() {
    return await Task.findAll();
  }

  async updateTaskById(id, data) {
    const task = await Task.findByPk(id);
    if (!task) {
      throw new Error("Задача не найдена");
    }
    // Обновляем свойства задачи
    Object.assign(task, data);
    await task.save();
    return task;
  }

  async deleteTaskById(id) {
    const task = await Task.findByPk(id);
    if (!task) {
      throw new Error("Задача не найдена");
    }
    await task.destroy();
  }

  async getTasksByRoomNumber(roomNumber) {
    const locations = await Location.findAll({
      where: { RoomNumber: roomNumber },
    });

    if (locations.length === 0) {
      throw new Error("Локаций не найдено для данного номера комнаты");
    }

    const locationIds = locations.map((location) => location.LocationId);

    const tasks = await Task.findAll({
      where: { LocationId: locationIds },
    });

    if (tasks.length === 0) {
      throw new Error("Задач не найдено для данной комнаты");
    }

    return tasks;
  }

  async getTasksByCategory(category) {
    const tasks = await Task.findAll({
      where: { Category: category },
    });

    if (tasks.length === 0) {
      throw new Error("Задачи не найдены для данной категории");
    }

    return tasks;
  }

  async getTaskById(taskId) {
    try {
      const task = await Task.findByPk(taskId);
      if (!task) {
        throw new Error("Task not found.");
      }
      return task;
    } catch (error) {
      throw error;
    }
  }
}

module.exports = new TaskService();
