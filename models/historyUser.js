const { DataTypes } = require("sequelize");
const sequelize = require("../db");

const HistoryUser = sequelize.define("HistoryUser", {
  HistoryUserId: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  ActionType: { type: DataTypes.STRING(50), allowNull: false },
  ActionTime: { type: DataTypes.DATE, allowNull: false },
  ChangeableUserID: { type: DataTypes.INTEGER, allowNull: false },
  AdminUserID: { type: DataTypes.INTEGER, allowNull: true },
});

module.exports = HistoryUser;
