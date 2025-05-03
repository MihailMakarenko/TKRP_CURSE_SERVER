const Location = require("../models/location");

class LocationService {
  // В вашем LocationService
  async findLocation({ CorpsNumber, HullNumber, RoomNumber }) {
    return await Location.findOne({
      where: {
        CorpsNumber,
        HullNumber,
        RoomNumber,
      },
    });
  }

  async addLocation(data) {
    return await Location.create(data);
  }

  async getAllLocations() {
    return await Location.findAll();
  }

  async updateLocationById(id, data) {
    const location = await Location.findByPk(id);
    if (!location) {
      throw new Error("Местоположение не найдено");
    }
    // Обновляем свойства местоположения
    Object.assign(location, data);
    await location.save();
    return location;
  }

  async deleteLocationById(id) {
    const location = await Location.findByPk(id);
    if (!location) {
      throw new Error("Местоположение не найдено");
    }
    await location.destroy();
  }

  async getLocationId(corpsNumber, hullNumber, roomNumber) {
    try {
      // Ищем местоположение по заданным параметрам
      const location = await Location.findOne({
        where: {
          CorpsNumber: corpsNumber,
          HullNumber: hullNumber,
          RoomNumber: roomNumber,
        },
      });

      // Если местоположение найдено, возвращаем его ID
      if (location) {
        return { id: location.LocationId };
      } else {
        throw new Error("Местоположение не найдено.");
      }
    } catch (error) {
      console.error("Ошибка при получении ID местоположения:", error);
      throw new Error("Ошибка при получении ID местоположения");
    }
  }
}

module.exports = new LocationService();
