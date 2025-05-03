// models/User.js
const { DataTypes } = require("sequelize");
const sequelize = require("../db");

const User = sequelize.define("User", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  Email: {
    type: DataTypes.STRING(50),
    allowNull: false,
    unique: true,
  },
  FirstName: {
    type: DataTypes.STRING(50),
    allowNull: false,
  },
  SecondName: {
    type: DataTypes.STRING(50),
    allowNull: true,
  },
  LastName: {
    type: DataTypes.STRING(50),
    allowNull: false,
  },
  Password: {
    type: DataTypes.STRING(100),
    allowNull: false,
  },
  PhoneNumber: {
    type: DataTypes.STRING(20),
    allowNull: true,
  },
  Role: {
    type: DataTypes.STRING(50),
    allowNull: false,
    defaultValue: "user",
    validate: {
      isIn: [["Администратор", "пользователь", "работник", "начальник"]], // Проверка на допустимые значения добавь свои
    },
  },
  StatusNow: {
    type: DataTypes.STRING(50),
    allowNull: false,
    defaultValue: "not activated",
  },

  ImageName: { type: DataTypes.STRING(255), allowNull: true },

  chatIdTg: {
    type: DataTypes.BIGINT, // Используйте BIGINT для больших чисел
    allowNull: true,
    unique: true,
  },
});

module.exports = User;
