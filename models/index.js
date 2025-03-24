const sequelize = require("../db");
const Comment = require("./comment");
const HistoryUser = require("./historyUser");
const Location = require("./location");
const Notification = require("./notification");
const Request = require("./request");
const RequestHistory = require("./requestHistory");
const Task = require("./task");
const User = require("./user");

// Установите связи между моделями

// User can create many Comments
User.hasMany(Comment, { foreignKey: "UserId", as: "comments" });
Comment.belongsTo(User, { foreignKey: "UserId", as: "user" });

// User can create many Requests
User.hasMany(Request, { foreignKey: "UserId", as: "requests" });
Request.belongsTo(User, { foreignKey: "UserId", as: "user" });

// User can change many HistoryUsers
User.hasMany(HistoryUser, { foreignKey: "AdminUserID", as: "historyUsers" });
HistoryUser.belongsTo(User, { foreignKey: "AdminUserID", as: "adminUser" });

// User can have many Notifications
User.hasMany(Notification, { foreignKey: "UserId", as: "notifications" });
Notification.belongsTo(User, { foreignKey: "UserId", as: "user" });

// Request can have many Comments
Request.hasMany(Comment, { foreignKey: "RequestId", as: "comments" });
Comment.belongsTo(Request, { foreignKey: "RequestId", as: "request" });

// Request can have many RequestHistories
Request.hasMany(RequestHistory, {
  foreignKey: "RequestId",
  as: "requestHistories",
});
RequestHistory.belongsTo(Request, { foreignKey: "RequestId", as: "request" });

// Task can belong to many Requests
Request.belongsTo(Task, { foreignKey: "TaskId", as: "task" });
Task.hasMany(Request, { foreignKey: "TaskId", as: "requests" });

// Location can have many Tasks
Location.hasMany(Task, { foreignKey: "LocationId", as: "tasks" });
Task.belongsTo(Location, { foreignKey: "LocationId", as: "location" });

// Установите связи для RequestHistory
RequestHistory.belongsTo(User, { foreignKey: "UserId", as: "user" });

// Убедитесь, что Request не имеет дублирующего алиаса для RequestHistory
// Установите уникальный алиас для RequestHistory, если необходимо
RequestHistory.belongsTo(Request, {
  foreignKey: "RequestId",
  as: "requestHistory",
});

// Синхронизация с базой данных
sequelize.sync().then(() => {
  console.log("Database & tables created!");
});

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
};
