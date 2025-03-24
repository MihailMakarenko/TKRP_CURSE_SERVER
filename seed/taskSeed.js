// Файл: seedTasks.js
const Task = require("../models/task"); // Путь к модели Task

class SeedTasks {
  async seed() {
    const tasks = [
      {
        Category: "Обслуживание",
        Description: "Проверка оборудования в корпусе 1.",
        PhotoPath: "Group45.png",
        LocationId: 1, // Убедитесь, что такие местоположения существуют
      },
      {
        Category: "Ремонт",
        Description: "Ремонт системы отопления в корпусе 2.",
        PhotoPath: "Group45.png",
        LocationId: 2,
      },
      {
        Category: "Уборка",
        Description: "Уборка в аудитории 201.",
        PhotoPath: null,
        LocationId: 1,
      },
      {
        Category: "Проверка",
        Description: "Проверка системы безопасности в корпусе 3.",
        PhotoPath: "Group45.png",
        LocationId: 3,
      },
      {
        Category: "Обслуживание",
        Description: "Проверка электрических систем в корпусе 4.",
        PhotoPath: "Group45.png",
        LocationId: 4,
      },
      {
        Category: "Ремонт",
        Description: "Ремонт крыши в корпусе 1.",
        PhotoPath: "Group45.png",
        LocationId: 1,
      },
      {
        Category: "Уборка",
        Description: "Уборка в коридоре 3 этажа.",
        PhotoPath: null,
        LocationId: 2,
      },
      {
        Category: "Обслуживание",
        Description: "Регулярное обслуживание системы вентиляции.",
        PhotoPath: "Group45.png",
        LocationId: 3,
      },
    ];

    try {
      const existingTasks = await Task.count();

      if (existingTasks === 0) {
        await Task.bulkCreate(tasks);
        console.log("База данных задач успешно заполнена.");
      } else {
        console.log(
          "База данных задач уже содержит записи. Новые записи не будут добавлены."
        );
      }
    } catch (error) {
      console.error("Ошибка при заполнении базы данных задач:", error);
    }
  }
}

module.exports = SeedTasks; // Экспортируем класс
