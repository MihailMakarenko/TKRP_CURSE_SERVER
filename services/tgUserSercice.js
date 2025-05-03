const axios = require("axios");
const { Op } = require("sequelize");
const TgUser = require("../models/tgUser");
const User = require("../models/user");

class TgUserService {
  constructor(botToken = "") {
    this.TELEGRAM_BOT_TOKEN = botToken;
  }

  // Основные методы
  async createTgUser(
    chatId,
    first_name,
    last_name = "",
    username = "неизвестный"
  ) {
    try {
      const [user] = await TgUser.findOrCreate({
        where: { chatId },
        defaults: { first_name, last_name, username },
      });
      return user;
    } catch (error) {
      console.error("Ошибка создания пользователя:", error);
      throw error;
    }
  }

  async getWorkersChatIds() {
    try {
      const users = await User.findAll({
        attributes: ["chatIdTg"],
        where: {
          chatIdTg: { [Op.not]: null },
          Role: { [Op.in]: ["работник", "начальник"] },
        },
        raw: true,
      });
      return users.map((user) => user.chatIdTg).filter(Boolean);
    } catch (error) {
      console.error("Ошибка получения chatId:", error);
      return [];
    }
  }

  async sendNotification(chatId, message) {
    try {
      await axios.post(
        `https://api.telegram.org/bot${this.TELEGRAM_BOT_TOKEN}/sendMessage`,
        {
          chat_id: chatId,
          text: message,
          parse_mode: "Markdown",
        }
      );
    } catch (error) {
      console.error(`Ошибка отправки для chatId ${chatId}:`, error.message);
      throw error;
    }
  }

  async checkChatId(chatId) {
    const response = TgUser.findByPk(chatId);
    return response;
  }

  async notifyWorkers(request, task, location) {
    try {
      const chatIds = await this.getWorkersChatIds();
      if (!chatIds.length) return;

      const message = this.formatNotification(request, task, location);
      await Promise.allSettled(
        chatIds.map((chatId) => this.sendNotification(chatId, message))
      );
    } catch (error) {
      console.error("Ошибка рассылки уведомлений:", error);
      throw error;
    }
  }

  // Вспомогательные методы
  formatNotification(request, task, location) {
    return (
      `🚨 Новая заявка #${request.dataValues.RequestId}\n\n` +
      `📋 Категория: ${task.dataValues.Category}\n` +
      `📝 Описание: ${task.dataValues.Description}\n\n` +
      `📍 Местоположение:\n` +
      `▫️ Корпус: ${location.dataValues.CorpsNumber}\n` +
      `▫️ Этаж: ${location.dataValues.HullNumber}\n` +
      `▫️ Аудитория: ${location.dataValues.RoomNumber}\n\n` +
      `⚡ Приоритет: ${request.dataValues.RequestPriority}`
    );
  }
}

module.exports = new TgUserService();
