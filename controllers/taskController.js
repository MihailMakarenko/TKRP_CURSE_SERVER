const path = require("path"); // Импортируйте модуль path
const fs = require("fs"); // Импортируйте модуль fs
const TaskService = require("../services/TaskService");
const Task = require("../models/task"); // Импортируйте модель Task
const Request = require("../models/request"); // Импортируйте модель Request
const Location = require("../models/location"); // Импортируйте сервис для поиска LocationId
const tgService = require("../services/tgUserSercice");

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

  async createTask(req, res) {
    const {
      requestType,
      description,
      corpsNumber,
      hullNumber,
      roomNumber,
      priority,
    } = req.body;
    // Получаем userId из токена
    const userId = req.user.id; // Предполагается, что id хранится в токене
    const photoPath = req.file ? `${req.file.filename}` : null;
    try {
      // Находим LocationId
      const location = await Location.findOne({
        where: {
          CorpsNumber: corpsNumber,
          HullNumber: hullNumber,
          RoomNumber: roomNumber,
        },
      });
      if (!location) {
        return res.status(404).json({
          success: false,
          message: "Местоположение не найдено.",
        });
      }
      const locationId = location.LocationId;
      // Создаем новую задачу
      const newTask = await Task.create({
        Category: requestType,
        Description: description,
        PhotoPath: photoPath,
        LocationId: locationId,
      });
      // Создаем новый запрос
      const newRequest = await Request.create({
        RequestPriority: priority,
        DateTime: new Date(),
        RequestStatus: "новый",
        TaskId: newTask.TaskId,
        UserId: userId,
      });

      tgService.notifyWorkers(newRequest, newTask, location);

      // Возвращаем ID задачи, ID местоположения и ID запроса
      return res.status(201).json({
        taskId: newTask.TaskId,
        locationId: locationId,
        requestId: newRequest.RequestId,
      });
    } catch (error) {
      console.error("Ошибка при создании задачи и запроса:", error);
      return res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }
}

module.exports = new TaskController();
