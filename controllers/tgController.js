const axios = require("axios");
const TELEGRAM_BOT_TOKEN = "";
const tgUserService = require("../services/tgUserSercice");

class TgController {
  constructor() {
    this.lastUpdateId = 0; // Для отслеживания последнего обработанного обновления
    this.startPolling(); // Запускаем опрос при создании экземпляра
  }

  async deleteWebhook() {
    const url = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/deleteWebhook`;
    try {
      const response = await axios.post(url);
      console.log("Webhook удален:", response.data);
    } catch (error) {
      console.error("Ошибка удаления вебхука:", error.message);
    }
  }

  // Вспомогательная функция для отправки сообщения
  async sendMessage(chatId, text) {
    const url = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`;
    try {
      await axios.post(url, {
        chat_id: chatId,
        text: text,
      });
    } catch (error) {
      console.error("Ошибка отправки сообщения:", error.message);
    }
  }

  async processUpdates() {
    const url = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/getUpdates?offset=${
      this.lastUpdateId + 1
    }&limit=100`;

    try {
      const response = await axios.get(url);
      const updates = response.data.result || [];

      if (updates.length === 0) {
        return;
      }

      for (const update of updates) {
        if (update.message && update.message.text) {
          const chatId = update.message.chat.id;
          const firstName = update.message.chat.first_name || "Пользователь";
          const lastName = update.message.chat.last_name || "";
          const username = update.message.chat.username || "неизвестный";

          console.log(
            `Chat ID: ${chatId}, First Name: ${firstName}, Last Name: ${lastName}, Username: ${username}`
          );

          await tgUserService.createTgUser(
            chatId,
            firstName,
            lastName,
            username
          );

          const messageText = update.message.text.toLowerCase();
          console.log(
            `Получено сообщение от ${firstName} (${chatId}): ${messageText}`
          );

          let replyText;
          switch (messageText) {
            case "/start":
              replyText = `Привет, ${firstName} ${lastName}! Ваш chatId: ${chatId}. Ваше имя пользователя: ${username}. Напишите что-нибудь!`;
              break;
            case "привет":
              replyText = `Здравствуй, ${firstName}! Как дела?`;
              break;
            case "пока":
              replyText = `До свидания, ${firstName}!`;
              break;
            default:
              replyText = `Ты написал: "${messageText}". Я пока просто повторяю!`;
          }

          await this.sendMessage(chatId, replyText);
        }
      }

      this.lastUpdateId = Math.max(
        ...updates.map((update) => update.update_id)
      );
    } catch (error) {
      if (error.response && error.response.status === 409) {
        console.warn("Конфликт запросов! Ожидание перед следующим запросом...");
        await new Promise((resolve) => setTimeout(resolve, 5000)); // Ждём 5 секунд
      } else {
        console.error("Ошибка получения обновлений:", error);
      }
    }
  }

  startPolling() {
    console.log("Polling запущен...");
    this.deleteWebhook(); // Удаляем вебхук перед началом опроса
    this.poll();
  }

  async poll() {
    try {
      await this.processUpdates();
    } catch (error) {
      console.error("Ошибка в процессе опроса:", error);
    }
    setTimeout(() => this.poll(), 2000); // Ждём 2 секунды перед следующим запросом
  }
}

module.exports = new TgController();
