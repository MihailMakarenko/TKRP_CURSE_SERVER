const path = require("path"); // Импортируйте модуль path
const fs = require("fs"); // Импортируйте модуль fs
const TaskService = require("../services/TaskService");

class TaskController {
  async addTask(req, res) {
    const { Category, Description, PhotoPath, LocationId } = req.body;
    try {
      const newTask = await TaskService.addTask({
        Category,
        Description,
        PhotoPath,
        LocationId,
      });
      res.status(201).json(newTask);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }

  async getAll(req, res) {
    try {
      const tasks = await TaskService.getAllTasks();

      // Формируем путь для каждого изображения, если PhotoPath существует
      const tasksWithPhotoPaths = tasks.map((task) => {
        if (task.PhotoPath) {
          task.PhotoPath = `${req.protocol}://${req.get(
            "host"
          )}/uploads/tasksPhoto/${task.PhotoPath}`;
        }
        return task;
      });

      res.status(200).json(tasksWithPhotoPaths);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  async updateTaskById(req, res) {
    const { id } = req.params;
    const { Category, Description, PhotoPath, LocationId } = req.body;
    try {
      const updatedTask = await TaskService.updateTaskById(id, {
        Category,
        Description,
        PhotoPath,
        LocationId,
      });
      res.status(200).json(updatedTask);
    } catch (error) {
      if (error.message === "Задача не найдена") {
        return res.status(404).json({ message: error.message });
      }
      res.status(400).json({ message: error.message });
    }
  }

  async deleteTaskById(req, res) {
    const { id } = req.params;
    try {
      await TaskService.deleteTaskById(id);
      res.status(204).send();
    } catch (error) {
      if (error.message === "Задача не найдена") {
        return res.status(404).json({ message: error.message });
      }
      res.status(500).json({ message: error.message });
    }
  }

  async getTasksByRoomNumber(req, res) {
    const { roomNumber } = req.params;
    try {
      const tasks = await TaskService.getTasksByRoomNumber(roomNumber);
      res.status(200).json(tasks);
    } catch (error) {
      res.status(404).json({ message: error.message });
    }
  }

  async getTasksByCategory(req, res) {
    const { category } = req.params;
    if (!category) {
      return res.status(400).json({ message: "Необходимо указать категорию" });
    }
    try {
      const tasks = await TaskService.getTasksByCategory(category);
      res.status(200).json(tasks);
    } catch (error) {
      res.status(404).json({ message: error.message });
    }
  }

  async getTask(req, res) {
    const taskId = req.params.id;

    try {
      const task = await TaskService.getTaskById(taskId);
      if (task.PhotoPath) {
        task.PhotoPath = `${req.protocol}://${req.get(
          "host"
        )}/api/task/uploads/tasksPhoto/${task.PhotoPath}`;
      }
      return res.status(200).json(task);
    } catch (error) {
      return res.status(404).json({ message: error.message });
    }
  }

  async getPhoto(req, res) {
    const photoName = req.params.photoName;
    const photoPath = path.join(
      __dirname,
      "..",
      "uploads",
      "tasksPhoto",
      photoName
    );

    fs.access(photoPath, fs.constants.F_OK, (err) => {
      if (err) {
        return res.status(404).json({ message: "Файл не найден" });
      }
      res.sendFile(photoPath);
    });
  }
}

module.exports = new TaskController();
