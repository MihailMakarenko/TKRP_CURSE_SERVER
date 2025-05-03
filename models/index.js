const sequelize = require("../db");
const Comment = require("./comment");
const HistoryUser = require("./historyUser");
const Location = require("./location");
const Notification = require("./notification");
const Request = require("./request");
const RequestHistory = require("./requestHistory");
const Task = require("./task");
const User = require("./user");
const TgUser = require("./tgUser");

// Установите связи между моделями
User.hasMany(Comment, { foreignKey: "UserId", as: "comments" });
Comment.belongsTo(User, { foreignKey: "UserId", as: "user" });

User.hasMany(Request, { foreignKey: "UserId", as: "requests" });
Request.belongsTo(User, { foreignKey: "UserId", as: "user" });

User.hasMany(HistoryUser, { foreignKey: "AdminUserID", as: "historyUsers" });
HistoryUser.belongsTo(User, { foreignKey: "AdminUserID", as: "adminUser" });

User.hasMany(Notification, { foreignKey: "UserId", as: "notifications" });
Notification.belongsTo(User, { foreignKey: "UserId", as: "user" });

Request.hasMany(Comment, { foreignKey: "RequestId", as: "comments" });
Comment.belongsTo(Request, { foreignKey: "RequestId", as: "request" });

Request.hasMany(RequestHistory, {
  foreignKey: "RequestId",
  as: "requestHistories",
});
RequestHistory.belongsTo(Request, { foreignKey: "RequestId", as: "request" });

Request.belongsTo(Task, { foreignKey: "TaskId", as: "task" });
Task.hasMany(Request, { foreignKey: "TaskId", as: "requests" });

Location.hasMany(Task, { foreignKey: "LocationId", as: "tasks" });
Task.belongsTo(Location, { foreignKey: "LocationId", as: "location" });

RequestHistory.belongsTo(User, { foreignKey: "UserId", as: "user" });
RequestHistory.belongsTo(Request, {
  foreignKey: "RequestId",
  as: "requestHistory",
});

TgUser.hasOne(User, { foreignKey: "chatIdTg", sourceKey: "chatId" });
User.belongsTo(TgUser, { foreignKey: "chatIdTg", targetKey: "chatId" });

// Асинхронная функция для синхронизации
async function syncDatabase() {
  try {
    await sequelize.sync();
    // await User.sync(); // 1
    // await Location.sync(); // 2
    // await Task.sync(); // 3
    // await Request.sync(); // 4
    // await RequestHistory.sync(); // 6
    // await Comment.sync(); // 5
    // await Notification.sync(); // 7
    // await HistoryUser.sync(); // 8
    // await TgUser.sync(); // 9
    console.log("Database & tables created!");
  } catch (error) {
    console.error("Error syncing database:", error);
  }
}

// Вызов синхронизации
syncDatabase();

module.exports = {
  sequelize,
  Comment,
  HistoryUser,
  Location,
  Notification,
  Request,
  RequestHistory,
  Task,
  User,
  TgUser,
};
