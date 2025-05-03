const { DataTypes } = require("sequelize");
const sequelize = require("../db");

const TgUser = sequelize.define("TgUser", {
  chatId: {
    type: DataTypes.BIGINT, // Используйте BIGINT для больших чисел
    primaryKey: true,
    allowNull: false,
  },
  first_name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  last_name: {
    type: DataTypes.STRING,
    allowNull: true, // Может быть пустым
  },
  username: {
    type: DataTypes.STRING,
    allowNull: true, // Может быть пустым
  },
});

// Экспортируем модель
module.exports = TgUser;
