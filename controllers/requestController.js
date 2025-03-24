const RequestService = require("../services/RequestService");
// const TaskService = require

class RequestController {
  // Добавить новый запрос
  async addRequest(req, res) {
    const { RequestPriority, DateTime, RequestStatus, TaskId, UserId } =
      req.body;
    try {
      const newRequest = await RequestService.addRequest({
        RequestPriority,
        DateTime,
        RequestStatus,
        TaskId,
        UserId,
      });
      res.status(201).json(newRequest);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }

  async addTaskAndRequest(req, res) {
    const {
      Category,
      Description,
      PhotoPath,
      LocationId,
      RequestPriority,
      DateTime,
      RequestStatus,
      UserId,
    } = req.body;

    const transaction = await sequelize.transaction(); // Создаем транзакцию

    try {
      // Добавляем новую задачу
      const newTask = await TaskService.addTask(
        {
          Category,
          Description,
          PhotoPath,
          LocationId,
        },
        { transaction }
      );

      // Добавляем новый запрос с ID задачи
      const newRequest = await RequestService.addRequest(
        {
          RequestPriority,
          DateTime,
          RequestStatus,
          TaskId: newTask.id, // Используем ID только что созданной задачи
          UserId,
        },
        { transaction }
      );

      // Подтверждаем транзакцию
      await transaction.commit();

      // Возвращаем созданные объекты
      res.status(201).json({ newTask, newRequest });
    } catch (error) {
      // Откатываем транзакцию в случае ошибки
      await transaction.rollback();
      res.status(400).json({ message: error.message });
    }
  }

  // Получить все запросы
  async getAll(req, res) {
    try {
      const requests = await RequestService.getAllRequests();
      res.status(200).json(requests);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  // Обновить запрос по ID
  async updateRequestById(req, res) {
    const { id } = req.params;
    const { RequestPriority, DateTime, RequestStatus, TaskId, UserId } =
      req.body;
    try {
      const updatedRequest = await RequestService.updateRequestById(id, {
        RequestPriority,
        DateTime,
        RequestStatus,
        TaskId,
        UserId,
      });
      res.status(200).json(updatedRequest);
    } catch (error) {
      if (error.message === "Запрос не найден") {
        return res.status(404).json({ message: error.message });
      }
      res.status(400).json({ message: error.message });
    }
  }

  // Удалить запрос по ID
  async deleteRequestById(req, res) {
    const { id } = req.params;
    try {
      await RequestService.deleteRequestById(id);
      res.status(204).send(); // Успешное удаление
    } catch (error) {
      if (error.message === "Запрос не найден") {
        return res.status(404).json({ message: error.message });
      }
      res.status(500).json({ message: error.message });
    }
  }

  // Получить запросы по UserId
  async getRequestsByUserId(req, res) {
    const { userId } = req.params;
    if (!userId) {
      return res.status(400).json({ message: "Необходимо указать UserId" });
    }
    try {
      const requests = await RequestService.getRequestsByUserId(userId);
      res.status(200).json(requests);
    } catch (error) {
      res.status(404).json({ message: error.message });
    }
  }

  async getRequestByUserWidthPagination(req, res) {
    console.log(req.query);
    const { limit, page } = req.query;
    try {
      const request = await RequestService.getRequestByUserWithPagination(
        limit,
        page
      );

      res.status(200).json(request);
    } catch (error) {
      res.status(404).json({ message: error.message });
    }
  }

  // Получить запросы по диапазону дат
  async getRequestsByDateRange(req, res) {
    const { startDate, endDate } = req.query;
    if (!startDate || !endDate) {
      return res
        .status(400)
        .json({ message: "Необходимо указать начальную и конечную даты" });
    }
    try {
      const requests = await RequestService.getRequestsByDateRange(
        startDate,
        endDate
      );
      res.status(200).json(requests);
    } catch (error) {
      res.status(404).json({ message: error.message });
    }
  }
}

module.exports = new RequestController();
