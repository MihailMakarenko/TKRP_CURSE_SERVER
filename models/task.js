const { DataTypes } = require("sequelize");
const sequelize = require("../db");

const Task = sequelize.define("Task", {
  TaskId: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  Category: { type: DataTypes.STRING(50), allowNull: false },
  Description: { type: DataTypes.STRING(255), allowNull: false },
  PhotoPath: { type: DataTypes.STRING(255), allowNull: true },
  LocationId: { type: DataTypes.INTEGER, allowNull: false },
});

module.exports = Task;
