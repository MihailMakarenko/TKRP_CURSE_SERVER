const sequelize = require("../db.js"); // Импорт настроек БД

const SeedUsers = require("./userSeed.js"); // Путь к сидеру
const SeedComments = require("./commentSeed.js"); // Путь к сидеру
const SeedHistoryUsers = require("./historyUserSeed.js"); // Путь к сидеру
const SeedLocations = require("./locationSeed.js"); // Путь к сидеру
const SeedNotifications = require("./nodificationSeed.js"); // Путь к сидеру
const SeedRequests = require("./requestSeed.js"); // Путь к сидеру
const SeedRequestHistory = require("./requestHistorySeed.js"); // Путь к сидеру
const SeedTasks = require("./taskSeed.js"); // Путь к сидеру

async function seedDatabase() {
  try {
    await sequelize.authenticate(); // Подключение к БД
    //await sequelize.sync({ force: true }); // ВНИМАНИЕ: это удалит все ваши данные в таблицах

    const seedUsers = new SeedUsers();
    await seedUsers.seed();

    const seedLocations = new SeedLocations();
    await seedLocations.seed();

    const seedTasks = new SeedTasks();
    await seedTasks.seed();

    const seedRequests = new SeedRequests();
    await seedRequests.seed();

    const seedRequestHistory = new SeedRequestHistory();
    await seedRequestHistory.seed();

    const seedComments = new SeedComments();
    await seedComments.seed();

    const seedNotifications = new SeedNotifications();
    await seedNotifications.seed();

    const seedHistoryUsers = new SeedHistoryUsers();
    await seedHistoryUsers.seed();

    console.log("Database seeded successfully!");
  } catch (error) {
    console.error("Error seeding the database:", error);
  }
}

module.exports = seedDatabase;
