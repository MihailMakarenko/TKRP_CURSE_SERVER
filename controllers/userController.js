const UserService = require("../services/UserService");
const path = require("path"); // Импортируйте модуль path
const fs = require("fs"); // Импортируйте модуль fs
const generator = require("password-generator");
const User = require("../models/user");
const jwt = require("jsonwebtoken");
const { use } = require("passport");
const SECRET_KEY = process.env.SECRET_KEY;

class UserController {
  // метод сброса пароля
  async forgotPassword(req, res) {
    const { email } = req.body;

    try {
      const result = await UserService.resetPassword(email);
      return res.status(200).json(result);
    } catch (error) {
      return res.status(404).json({
        success: false,
        message: error.message,
      });
    }
  }

  // метод входа
  async login(req, res) {
    const { Email, Password } = req.body; // Извлекаем данные из тела запроса

    if (!Email || !Password) {
      return res.status(400).json({
        success: false,
        message: "Email и Password обязательны.",
      });
    }

    try {
      const user = await UserService.login(Email, Password);

      // Генерируем токен, если используется аутентификация на основе токенов
      const token = generateToken(user.id); // Ваша логика генерации токена

      if (user.ImageName) {
        user.ImageName = `${req.protocol}://${req.get(
          "host"
        )}/api/user/uploads/userPhoto/${user.ImageName}`;
      }

      res.status(200).json({
        userId: user.id,
        email: user.Email,
        firstName: user.FirstName,
        secondName: user.SecondName,
        lastName: user.LastName,
        phoneNumber: user.PhoneNumber,
        photoPath: user.ImageName,
        role: user.Role,
        token: token, // Возвращаем токен
      });
    } catch (error) {
      console.error("Ошибка при входе:", error.message); // Логируем сообщение об ошибке
      res.status(401).json({
        // Возвращаем статус 401 для неверных учетных данных
        success: false,
        message: error.message || "Произошла ошибка при входе.", // Возвращаем сообщение об ошибке
      });
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
    // console.log(finalPassword);

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

  async getPhoto(req, res) {
    const photoName = req.params.photoName;
    const photoPath = path.join(
      __dirname,
      "..",
      "uploads",
      "userPhoto",
      photoName
    );

    fs.access(photoPath, fs.constants.F_OK, (err) => {
      if (err) {
        return res.status(404).json({ message: "Файл не найден" });
      }
      res.sendFile(photoPath);
    });
  }

  async updateUser(req, res) {
    try {
      const { Email, PhoneNumber, SecondName } = req.body;

      const photoPath = req.file ? `${req.file.filename}` : null; // Получаем путь к загруженному файлу

      const userId = req.user.id;

      const updatedUser = await UserService.updateUser(
        userId,
        Email,
        PhoneNumber,
        photoPath,
        SecondName
      );

      console.log(updatedUser);

      if (updatedUser.ImageName) {
        updatedUser.ImageName = `${req.protocol}://${req.get(
          "host"
        )}/api/user/uploads/userPhoto/${updatedUser.ImageName}`;
      }

      return res.status(200).json({
        success: true,
        message: "Данные пользователя успешно обновлены",
        data: {
          userId: updatedUser.id,
          email: updatedUser.Email,
          firstName: updatedUser.FirstName,
          secondName: updatedUser.SecondName,
          lastName: updatedUser.LastName,
          phoneNumber: updatedUser.PhoneNumber,
          photoPath: updatedUser.ImageName,
          role: updatedUser.Role,
        },
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: error.message || "Ошибка обновления данных",
      });
    }
  }

  async getUserWithPagination(req, res) {
    // Устанавливаем значения по умолчанию для limit и page
    const { limit = 10, page = 1 } = req.query;

    try {
      // Преобразуем limit и page в числа
      const limitNumber = parseInt(limit, 10);
      const pageNumber = parseInt(page, 10);

      // Проверка на NaN или отрицательные числа
      if (isNaN(limitNumber) || limitNumber <= 0) {
        return res.status(400).json({
          message: "Параметр limit должен быть положительным числом.",
        });
      }
      if (isNaN(pageNumber) || pageNumber <= 0) {
        return res
          .status(400)
          .json({ message: "Параметр page должен быть положительным числом." });
      }

      const { users, totalCount } = await UserService.getUserWithPagination(
        limitNumber,
        pageNumber
      );

      res.status(200).json({ users, totalCount });
    } catch (error) {
      res.status(404).json({ message: error.message });
    }
  }

  async addChatIdTg(req, res) {
    const { chatId } = req.body;
    console.log("AAAAAAAAAAAA");
    console.log(chatId);
    const userId = req.user.id;

    const result = await UserService.AddChatId(userId, chatId);

    if (result.success) {
      return res.status(200).json({ message: result.message });
    } else {
      return res.status(400).json({ message: result.message });
    }
  }

  async GetPdfReport(req, res) {
    try {
      // Генерируем PDF отчет
      const pdfBuffer = await UserService.generateUsersPdf();

      // Устанавливаем заголовки для скачивания файла
      res.setHeader("Content-Type", "application/pdf");
      res.setHeader(
        "Content-Disposition",
        "attachment; filename=users_report.pdf"
      );

      // Отправляем PDF клиенту
      res.send(pdfBuffer);
    } catch (error) {
      console.error("Ошибка при генерации PDF отчета:", error);

      // Отправляем ошибку клиенту
      res.status(500).json({
        success: false,
        message: "Произошла ошибка при генерации отчета",
        error: error.message,
      });
    }
  }

  async getUserHistoryPdf(req, res) {
    try {
      const { userId } = req.params;

      // Генерация PDF
      const pdfBuffer = await UserService.generateUserHistoryPdf(userId);

      // Настройка заголовков ответа
      res.set({
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename=user_${userId}_history.pdf`,
        "Content-Length": pdfBuffer.length,
      });

      // Отправка PDF
      return res.send(pdfBuffer);
    } catch (error) {
      console.error("Ошибка генерации отчета:", error);

      if (error.message === "Пользователь не найден") {
        return res.status(404).json({
          success: false,
          message: error.message,
        });
      }

      return res.status(500).json({
        success: false,
        message: "Произошла ошибка при генерации отчета",
        error: error.message,
      });
    }
  }

  async deactivateUser(req, res) {
    try {
      const userId = req.params.userId;
      console.log(userId);
      // Находим пользователя по ID
      const user = await User.findByPk(userId);

      if (!user) {
        return res.status(404).json({ message: "Пользователь не найден" });
      }

      // Обновляем статус пользователя
      await user.update({ StatusNow: "deactivated" });

      return res.status(200).json({
        message: "Пользователь успешно деактивирован",
        user: user,
      });
    } catch (error) {
      console.error("Ошибка при деактивации пользователя:", error);
      return res.status(500).json({
        message: "Произошла ошибка при деактивации пользователя",
        error: error.message,
      });
    }
  }

  async deleteNotActivatedUsers(req, res) {
    try {
      // Удаляем всех пользователей со статусом "not activated"
      const result = await User.destroy({
        where: {
          StatusNow: "not activated", // Условие для удаления
        },
      });

      // Если ни одного пользователя не удалено
      if (result === 0) {
        return res.status(404).json({
          message: 'Нет пользователей со статусом "not activated" для удаления',
        });
      }

      // Успешное удаление
      return res.status(200).json({
        message: `Удалено ${result} пользователей со статусом "not activated"`,
        deletedCount: result,
      });
    } catch (error) {
      console.error(
        "Ошибка при удалении неактивированных пользователей:",
        error
      );
      return res.status(500).json({
        message: "Произошла ошибка при удалении неактивированных пользователей",
        error: error.message,
      });
    }
  }
}

function generateToken(userId, role) {
  // Устанавливаем время жизни токена
  const expiresIn = "1h"; // Токен будет действителен 1 час

  // Генерируем токен с id и role
  const token = jwt.sign({ id: userId, role: role }, SECRET_KEY, { expiresIn });
  return token;
}

module.exports = new UserController();
