const User = require("../models/user");
const bcrypt = require("bcryptjs");
const { sendPassword } = require("./EmailService");

class UserService {
  async login(email, password) {
    const user = await User.findOne({ where: { Email: email } });
    if (!user || !bcrypt.compareSync(password, user.Password)) {
      throw new Error("Неверный email или пароль");
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
}

module.exports = new UserService();
