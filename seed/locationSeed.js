// Файл: seedLocations.js
const Location = require("../models/location"); // Путь к модели Location

class SeedLocations {
  async seed() {
    const locations = [
      {
        CorpsNumber: 1,
        HullNumber: 1,
        RoomNumber: 101,
      },
      {
        CorpsNumber: 1,
        HullNumber: 2,
        RoomNumber: 202,
      },
      {
        CorpsNumber: 2,
        HullNumber: 3,
        RoomNumber: 301,
      },
      {
        CorpsNumber: 2,
        HullNumber: 3,
        RoomNumber: 302,
      },
      {
        CorpsNumber: 3,
        HullNumber: 4,
        RoomNumber: 401,
      },
      {
        CorpsNumber: 3,
        HullNumber: 4,
        RoomNumber: 402,
      },
      {
        CorpsNumber: 4,
        HullNumber: 5,
        RoomNumber: 501,
      },
      {
        CorpsNumber: 4,
        HullNumber: 5,
        RoomNumber: 502,
      },
    ];

    try {
      const existingLocations = await Location.count();

      if (existingLocations === 0) {
        await Location.bulkCreate(locations);
        console.log("База данных местоположений успешно заполнена.");
      } else {
        console.log(
          "База данных местоположений уже содержит записи. Новые записи не будут добавлены."
        );
      }
    } catch (error) {
      console.error("Ошибка при заполнении базы данных местоположений:", error);
    }
  }
}

module.exports = SeedLocations; // Экспортируем класс
