const LocationService = require("../services/LocationService");

class LocationController {
  // Добавить новое местоположение
  // В вашем контроллере
  async addLocation(req, res) {
    const { CorpsNumber, HullNumber, RoomNumber } = req.body;
    try {
      // Проверяем, существует ли запись с такими же данными
      const existingLocation = await LocationService.findLocation({
        CorpsNumber,
        HullNumber,
        RoomNumber,
      });

      if (existingLocation) {
        return res
          .status(409)
          .json({ message: "Запись с такими данными уже существует." });
      }

      const newLocation = await LocationService.addLocation({
        CorpsNumber,
        HullNumber,
        RoomNumber,
      });
      res.status(201).json(newLocation);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }

  // Получить все местоположения
  async getAll(req, res) {
    try {
      const locations = await LocationService.getAllLocations();
      res.status(200).json(locations);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  // Обновить местоположение по ID
  async updateLocationById(req, res) {
    const { id } = req.params;
    const { CorpsNumber, HullNumber, RoomNumber } = req.body;
    try {
      const updatedLocation = await LocationService.updateLocationById(id, {
        CorpsNumber,
        HullNumber,
        RoomNumber,
      });
      res.status(200).json(updatedLocation);
    } catch (error) {
      if (error.message === "Местоположение не найдено") {
        return res.status(404).json({ message: error.message });
      }
      res.status(400).json({ message: error.message });
    }
  }

  // Удалить местоположение по ID
  async deleteLocationById(req, res) {
    const { id } = req.params;
    try {
      await LocationService.deleteLocationById(id);
      res.status(204).send(); // Успешное удаление
    } catch (error) {
      if (error.message === "Местоположение не найдено") {
        return res.status(404).json({ message: error.message });
      }
      res.status(500).json({ message: error.message });
    }
  }
}

module.exports = new LocationController();
