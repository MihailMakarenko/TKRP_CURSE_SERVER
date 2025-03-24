const UserService = require("../services/UserService");
const generator = require("password-generator");
const User = require("../models/user");

class UserController {
  // Метод для входа
  async login(req, res) {
    const { Email, Password } = req.body;
    try {
      const user = await UserService.login(Email, Password);
      // Здесь можно добавить логику для генерации JWT или сеанса
      res.status(200).json(user);
    } catch (error) {
      res.status(401).json({ message: error.message });
    }
  }

  // Метод для регистрации
  async registration(req, res) {
    const {
      Email,
      FirstName,
      SecondName,
      LastName,
      PhoneNumber,
      Password,
      Role,
    } = req.body;

    // Генерация пароля, если он не предоставлен пользователем
    const finalPassword = Password || generator(12, false);
    console.log(finalPassword);

    // Проверка обязательных полей
    if (!Email || !FirstName || !LastName || !finalPassword || !Role) {
      return res
        .status(400)
        .json({ message: "Все поля обязательны для заполнения." });
    }

    // Проверка формата email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(Email)) {
      return res.status(400).json({ message: "Некорректный формат email." });
    }

    try {
      // Проверка на существование пользователя с таким email
      const existingUser = await User.findOne({ where: { Email } });
      if (existingUser) {
        return res
          .status(409)
          .json({ message: "Пользователь с таким email уже существует." });
      }

      // Создание нового пользователя
      const newUser = await UserService.registration({
        Email,
        FirstName,
        SecondName,
        LastName,
        PhoneNumber,
        Password: finalPassword,
        Role,
      });

      res.status(201).json({
        message: "Пользователь успешно зарегистрирован",
        user: newUser,
      });
    } catch (error) {
      console.error("Ошибка при регистрации:", error.message);
      res.status(500).json({ message: "Произошла ошибка при регистрации." });
    }

    // Если вы хотите отправить сообщение, если email не существует
    // это обычно происходит на этапе авторизации, а не регистрации.
    const userToCheck = await User.findOne({ where: { Email } });
    if (!userToCheck) {
      return res
        .status(404)
        .json({ message: "Пользователь с таким email не найден." });
    }
  }
  // Метод для получения всех пользователей
  async getAll(req, res) {
    try {
      const users = await UserService.getAllUsers();
      res.status(200).json(users);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  // Метод для обновления пользователя по ID
  async updateUserById(req, res) {
    const { id } = req.params;
    const {
      Email,
      FirstName,
      SecondName,
      LastName,
      Password,
      PhoneNumber,
      Role,
      StatusNow,
    } = req.body;
    try {
      const updatedUser = await UserService.updateUserById(id, {
        Email,
        FirstName,
        SecondName,
        LastName,
        Password, // Не забудьте хешировать пароль
        PhoneNumber,
        Role,
        StatusNow,
      });
      res.status(200).json(updatedUser);
    } catch (error) {
      if (error.message === "Пользователь не найден") {
        return res.status(404).json({ message: error.message });
      }
      res.status(400).json({ message: error.message });
    }
  }

  // Метод для удаления пользователя по ID
  async deleteUserById(req, res) {
    const { id } = req.params;
    try {
      await UserService.deleteUserById(id);
      res.status(204).send(); // Успешное удаление
    } catch (error) {
      if (error.message === "Пользователь не найден") {
        return res.status(404).json({ message: error.message });
      }
      res.status(500).json({ message: error.message });
    }
  }

  // Метод для получения пользователя по ID
  async getUserById(req, res) {
    const { id } = req.params;
    try {
      const user = await UserService.getUserById(id);
      res.status(200).json(user);
    } catch (error) {
      if (error.message === "Пользователь не найден") {
        return res.status(404).json({ message: error.message });
      }
      res.status(500).json({ message: error.message });
    }
  }
}

module.exports = new UserController();
