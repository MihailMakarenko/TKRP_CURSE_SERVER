const User = require("../models/user");
const PDFDocument = require("pdfkit");
const tgUserSercice = require("../services/tgUserSercice");
const bcrypt = require("bcryptjs");
const { sendPassword } = require("./EmailService");
const { resendPassword } = require("./EmailService");
const HistoryUser = require("../models/historyUser");

class UserService {
  async login(email, password) {
    const user = await User.findOne({ where: { Email: email } });
    if (!user) {
      throw new Error("Неверный email или пароль"); // Сообщение, если пользователь не найден
    }
    if (!bcrypt.compareSync(password, user.Password)) {
      throw new Error("Неверный email или пароль"); // Сообщение, если пароль неверен
    }

    // Проверка статуса пользователя
    if (user.StatusNow === "not activated") {
      user.StatusNow = "active"; // Изменяем статус на активный
      await user.save(); // Сохраняем изменения в базе данных
    }

    return user;
  }

  async registration(data) {
    const saltRounds = 10;

    try {
      const hashedPassword = bcrypt.hashSync(data.Password, saltRounds);
      const UserCreate = await User.create({
        ...data,
        Password: hashedPassword,
      });
      const response = await sendPassword(
        UserCreate.Email,
        data.Password
      ).catch((err) => {
        console.error("Ошибка при отправке пароля:", err);
        throw new Error("Failed to send password email");
      });
      return UserCreate;
    } catch (error) {
      console.error("Ошибка при регистрации:", error);
      throw error; // Или обработайте ошибку как вам нужно
    }
  }

  async getAllUsers() {
    return await User.findAll();
  }

  async updateUserById(id, data) {
    const user = await User.findByPk(id);
    if (!user) {
      throw new Error("Пользователь не найден");
    }
    // Обновляем свойства пользователя
    Object.assign(user, data);
    await user.save();
    return user;
  }

  async deleteUserById(id) {
    const user = await User.findByPk(id);
    if (!user) {
      throw new Error("Пользователь не найден");
    }
    await user.destroy();
  }

  async getUserById(id) {
    const user = await User.findByPk(id);
    if (!user) {
      throw new Error("Пользователь не найден");
    }
    return user;
  }

  async resetPassword(email) {
    // Проверяем, существует ли пользователь с таким email
    const user = await User.findOne({ where: { Email: email } });
    if (!user) {
      throw new Error("Пользователь с таким email не найден.");
    }

    // Генерируем новый пароль
    const newPassword = Math.random().toString(36).slice(-8); // Генерация случайного пароля длиной 8 символов
    const hashedPassword = bcrypt.hashSync(newPassword, 10); // Хэшируем новый пароль

    // Обновляем пароль пользователя в базе данных
    user.Password = hashedPassword;
    await user.save();

    // Отправляем email с новым паролем
    await resendPassword(email, newPassword);

    return {
      success: true,
      message: "Новый пароль отправлен на вашу почту.",
    };
  }

  async updateUser(UserId, Email, PhoneNumber, ImageName, SecondName) {
    console.log("AAAAAAAAAA");
    try {
      // Обновляем пользователя по UserId
      const [updatedRows, [updatedUser]] = await User.update(
        {
          Email,
          PhoneNumber,
          ImageName,
          SecondName,
        },
        {
          where: { id: UserId }, // Указываем условие для поиска пользователя
          returning: true, // Возвращаем обновленный объект
        }
      );

      // Проверяем, был ли обновлен пользователь
      if (updatedRows === 0) {
        throw new Error("Пользователь не найден или данные не изменены.");
      }

      return updatedUser; // Возвращаем обновленного пользователя
    } catch (error) {
      console.log(error);
      throw new Error(error.message || "Ошибка обновления пользователя");
    }
  }

  async getUserWithPagination(limit, page) {
    const offset = (page - 1) * limit;

    const [users, totalCount] = await Promise.all([
      User.findAll({
        limit: limit,
        offset: offset,
      }),
      User.count(), // Получаем общее количество пользователей
    ]);

    return { users, totalCount };
  }

  async AddChatId(userId, chatId) {
    try {
      // Проверяем, существует ли chatId в TgUser
      const tgUser = await tgUserSercice.checkChatId(chatId);

      if (tgUser) {
        // Обновляем поле chatIdTg в User
        const [updatedRowsCount] = await User.update(
          { chatIdTg: chatId }, // Новое значение для chatIdTg
          { where: { id: userId } } // Условие для обновления
        );

        console.log(updatedRowsCount);

        if (updatedRowsCount > 0) {
          return {
            success: true,
            message: `Телеграм успешно добавлен`,
          };
        } else {
          return {
            success: false,
            message: `Пользователь с ID ${userId} не найден.`,
          };
        }
      } else {
        return {
          success: false,
          message: `Пользователя с таким chatI: ${chatId} не существует `,
        };
      }
    } catch (error) {
      console.error("Ошибка при обновлении chatIdTg:", error);
      return {
        success: false,
        message: "Ошибка при обновлении chatIdTg.",
        error: error.message,
      };
    }
  }

  async generateUsersPdf() {
    return new Promise(async (resolve, reject) => {
      try {
        const users = await User.findAll({
          attributes: [
            "id",
            "FirstName",
            "SecondName",
            "LastName",
            "Email",
            "PhoneNumber",
            "Role",
            "StatusNow",
          ],
          order: [["id", "ASC"]],
        });

        const doc = new PDFDocument({ margin: 5 });
        // Убедитесь, что шрифт существует по указанному пути
        doc.font("./Roboto/Roboto-Black.ttf");

        const buffers = [];
        doc.on("data", buffers.push.bind(buffers));
        doc.on("end", () => resolve(Buffer.concat(buffers)));

        // Заголовок
        doc
          .fontSize(20)
          .text("Отчет о пользователях", { align: "center" })
          .moveDown();

        // Дата
        doc
          .fontSize(10)
          .text(`Сформировано: ${new Date().toLocaleString("ru-RU")}`, {
            align: "center",
          })
          .moveDown(2);

        // Статистика
        doc.fontSize(14).text("Общая статистика:", { underline: true });
        const totalUsers = users.length;
        const roleCounts = users.reduce((acc, user) => {
          // Приводим роль к нижнему регистру для унификации сравнения
          const normalizedRole = user.Role.toLowerCase();
          acc[normalizedRole] = (acc[normalizedRole] || 0) + 1;
          return acc;
        }, {});

        // Правильный подсчет администраторов (учитываем возможные варианты написания)
        const adminCount =
          (roleCounts["администратор"] || 0) +
          (roleCounts["aдминистратор"] || 0); // На случай, если где-то есть опечатки

        doc
          .fontSize(12)
          .text(`Всего пользователей: ${totalUsers}`)
          .text(`Администраторов: ${adminCount}`) // Используем исправленный счетчик
          .text(`Пользователей: ${roleCounts["пользователь"] || 0}`)
          .text(`Работников: ${roleCounts["работник"] || 0}`)
          .text(`Начальников: ${roleCounts["начальник"] || 0}`)
          .moveDown(2);
        // Настройки таблицы
        const colWidths = [40, 150, 180, 90, 75, 100]; // Ширина колонок
        const rowHeight = 30;
        const startX = 20;
        let currentY = doc.y;

        // // Заголовки таблицы
        // doc.font("Helvetica-Bold");
        ["ID", "ФИО", "Email", "Телефон", "Роль", "Статус"].forEach(
          (header, i) => {
            doc.text(
              header,
              startX + colWidths.slice(0, i).reduce((a, b) => a + b, 0),
              currentY
            );
          }
        );
        currentY += rowHeight;

        // // Данные пользователей
        // doc.font("Helvetica");
        doc.fontSize(10);
        doc.font("./Roboto/Roboto-Regular.ttf");
        users.forEach((user, index) => {
          // Чередующийся цвет фона
          doc
            .fillColor(index % 2 === 0 ? "#f5f5f5" : "#ffffff")
            .rect(30, currentY, 550, rowHeight)
            .fill();

          doc.fillColor("#000");
          const fullName = `${user.LastName} ${user.FirstName}${
            user.SecondName ? " " + user.SecondName : ""
          }`;

          // Все данные пользователя в одной строке
          let xPos = startX;
          [
            user.id.toString(),
            fullName,
            user.Email,
            user.PhoneNumber || "-",
            user.Role,
            user.StatusNow,
          ].forEach((text, i) => {
            doc.text(text, xPos, currentY + 5, {
              width: colWidths[i] - 5,
              ellipsis: true, // Обрезать длинный текст с ...
            });
            xPos += colWidths[i];
          });

          currentY += rowHeight;

          // Перенос на новую страницу
          if (currentY > 750) {
            doc.addPage();
            currentY = 50;
            // Повторяем заголовки на новой странице
            doc.font("Helvetica-Bold");
            ["ID", "ФИО", "Email", "Телефон", "Роль", "Статус"].forEach(
              (header, i) => {
                doc.text(
                  header,
                  startX + colWidths.slice(0, i).reduce((a, b) => a + b, 0),
                  currentY
                );
              }
            );
            currentY += rowHeight;
            // doc.font("Helvetica");
          }
        });

        doc.end();
      } catch (error) {
        reject(error);
      }
    });
  }

  async generateUserHistoryPdf(userId) {
    return new Promise(async (resolve, reject) => {
      try {
        const history = await HistoryUser.findAll({
          where: { ChangeableUserID: userId },
          order: [["ActionTime", "DESC"]],
        });

        const user = await User.findByPk(userId);
        if (!user) {
          throw new Error("Пользователь не найден");
        }

        const doc = new PDFDocument({ margin: 30 });
        const buffers = [];
        doc.on("data", buffers.push.bind(buffers));
        doc.on("end", () => resolve(Buffer.concat(buffers)));

        // Установка шрифта
        doc.font("./Roboto/Roboto-Regular.ttf");

        // Заголовок отчета
        doc
          .fontSize(18)
          .text("Отчет по истории действий пользователя", { align: "center" })
          .moveDown(0.5);

        // Информация о пользователе
        const userName = `${user.LastName} ${user.FirstName}${
          user.SecondName ? " " + user.SecondName : ""
        }`;
        doc
          .fontSize(12)
          .text(`Пользователь: ${userName} (ID: ${userId})`)
          .text(`Email: ${user.Email}`)
          .text(`Роль: ${user.Role}`)
          .moveDown(1);

        // Дата генерации
        doc
          .fontSize(10)
          .text(`Сформировано: ${new Date().toLocaleString("ru-RU")}`, {
            align: "right",
          })
          .moveDown(2);

        // Статистика
        doc
          .fontSize(14)
          .text("Статистика действий:", { underline: true })
          .moveDown(0.5);

        const actionStats = history.reduce((acc, item) => {
          acc[item.ActionType] = (acc[item.ActionType] || 0) + 1;
          return acc;
        }, {});

        doc.fontSize(12);
        Object.entries(actionStats).forEach(([action, count]) => {
          doc.text(`${action}: ${count}`);
        });
        doc.text(`Всего действий: ${history.length}`).moveDown(2);

        // Таблица истории
        doc
          .fontSize(14)
          .text("Детальная история действий:", { underline: true })
          .moveDown(1);

        // Настройки таблицы
        const colWidths = [80, 150, 120, 150, 120];
        const rowHeight = 40;
        let yPos = doc.y;

        // Заголовки
        ["ID", "Действие", "Дата/время", "ID админа"].forEach((header, i) => {
          doc.text(
            header,
            30 + colWidths.slice(0, i).reduce((a, b) => a + b, 0),
            yPos
          );
        });
        yPos += rowHeight;

        // Данные
        history.forEach((record, index) => {
          // Фон строки
          doc
            .fillColor(index % 2 === 0 ? "#f5f5f5" : "#ffffff")
            .rect(30, yPos, 550, rowHeight)
            .fill();

          doc.fillColor("#000");

          // Безопасное преобразование данных
          const safeData = [
            record.HistoryUserId?.toString() ?? "-",
            record.ActionType ?? "-",
            record.ActionTime?.toLocaleString("ru-RU") ?? "-",
            record.AdminUserID?.toString() ?? "-",
          ];

          // Вывод данных
          let xPos = 30;
          safeData.forEach((text, i) => {
            doc.text(text, xPos, yPos + 5, {
              width: colWidths[i] - 5,
              ellipsis: true,
            });
            xPos += colWidths[i];
          });

          yPos += rowHeight;

          // Перенос страницы
          if (yPos > 750) {
            doc.addPage();
            yPos = 50;
            // Повтор заголовков
            [
              "ID",
              "Действие",
              "Дата/время",
              "Администратор",
              "ID админа",
            ].forEach((header, i) => {
              doc.text(
                header,
                30 + colWidths.slice(0, i).reduce((a, b) => a + b, 0),
                yPos
              );
            });
            yPos += rowHeight;
          }
        });

        doc.moveDown(2);
        doc
          .fontSize(7)
          .text("Отчет сгенерирован автоматически", { align: "center" });

        doc.end();
      } catch (error) {
        console.error("Ошибка генерации PDF:", error);
        reject(new Error("Не удалось сгенерировать отчет. Попробуйте позже."));
      }
    });
  }
}

module.exports = new UserService();
