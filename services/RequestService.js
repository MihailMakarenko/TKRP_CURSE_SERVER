const { model } = require("../db");
const Request = require("../models/request");
const { Task } = require("../models/index.js");
const { Location } = require("../models/index.js");
const { Comment } = require("../models/index.js");
const { Op } = require("sequelize");

class RequestService {
  async addRequest(data) {
    return await Request.create(data);
  }

  async getAllRequests() {
    return await Request.findAll();
  }

  async updateRequestById(id, data) {
    const request = await Request.findByPk(id);
    if (!request) {
      throw new Error("Запрос не найден");
    }
    // Обновляем свойства запроса
    Object.assign(request, data);
    await request.save();
    return request;
  }

  async deleteRequestById(id) {
    const request = await Request.findByPk(id);
    if (!request) {
      throw new Error("Запрос не найден");
    }
    await request.destroy();
  }

  async getRequestsByUserId(userId) {
    const requests = await Request.findAll({
      where: { UserId: userId },
    });
    if (requests.length === 0) {
      throw new Error("Запросы не найдены для данного пользователя");
    }
    return requests;
  }

  async getRequestsByDateRange(startDate, endDate) {
    const requests = await Request.findAll({
      where: {
        DateTime: {
          [Op.between]: [new Date(startDate), new Date(endDate)],
        },
      },
    });
    if (requests.length === 0) {
      throw new Error("Запросов не найдено за указанный период");
    }
    return requests;
  }

  async getRequestByUserWithPagination(limit, page) {
    const offset = (page - 1) * limit; // Расчет смещения для пагинации
    console.log("rst");

    const requests = await Request.findAll({
      limit: limit,
      offset: offset,
      include: [
        {
          model: Task,
          as: "task",
          include: [
            {
              model: Location,
              as: "location",
            },
          ],
        },
        {
          model: Comment,
          as: "comments",
        },
      ],
    });

    // Предположим, что вы хотите добавить префикс к PhotoPath
    const photoPrefix = "/task/uploads/tasksPhoto/"; // Ваш префикс

    const modifiedRequests = requests.map((request) => {
      // Если у вас есть доступ к PhotoPath через task
      if (request.task && request.task.PhotoPath) {
        request.task.PhotoPath = photoPrefix + request.task.PhotoPath;
      }
      return request;
    });

    if (requests.length === 0) {
      throw new Error("Запросов не найдено на текущей странице");
    }

    return requests;
  }
}

module.exports = new RequestService();
