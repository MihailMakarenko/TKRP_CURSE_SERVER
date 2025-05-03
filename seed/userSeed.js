// Файл: seedUsers.js
const User = require("../models/user"); // Путь к модели User
const TgUser = require("../models/tgUser");

class SeedUsers {
  async seed() {
    const users = [
      {
        Email: "admin@example.com",
        FirstName: "Alice",
        SecondName: "Johnson",
        LastName: "Smith",
        Password: "password123", // Не забудьте хэшировать пароли в реальном приложении
        PhoneNumber: "123-456-7890",
        Role: "Администратор",
        StatusNow: "active",
      },
      {
        Email: "user1@example.com",
        FirstName: "Bob",
        SecondName: "Brown",
        LastName: "Johnson",
        Password: "password123",
        PhoneNumber: "234-567-8901",
        Role: "пользователь",
        StatusNow: "active",
      },
      {
        Email: "user2@example.com",
        FirstName: "Charlie",
        SecondName: "Davis",
        LastName: "Williams",
        Password: "password123",
        PhoneNumber: "345-678-9012",
        Role: "пользователь",
        StatusNow: "active",
      },
      {
        Email: "user3@example.com",
        FirstName: "David",
        SecondName: "Wilson",
        LastName: "Jones",
        Password: "password123",
        PhoneNumber: "456-789-0123",
        Role: "пользователь",
        StatusNow: "active",
      },
      {
        Email: "user4@example.com",
        FirstName: "Eva",
        SecondName: "Garcia",
        LastName: "Martinez",
        Password: "password123",
        PhoneNumber: "567-890-1234",
        Role: "пользователь",
        StatusNow: "active",
      },
      {
        Email: "user5@example.com",
        FirstName: "Frank",
        SecondName: "Anderson",
        LastName: "Taylor",
        Password: "password123",
        PhoneNumber: "678-901-2345",
        Role: "пользователь",
        StatusNow: "active",
      },
      {
        Email: "user6@example.com",
        FirstName: "Grace",
        SecondName: "Thomas",
        LastName: "Hernandez",
        Password: "password123",
        PhoneNumber: "789-012-3456",
        Role: "пользователь",
        StatusNow: "active",
      },
      {
        Email: "user7@example.com",
        FirstName: "Hank",
        SecondName: "Moore",
        LastName: "Martin",
        Password: "password123",
        PhoneNumber: "890-123-4567",
        Role: "пользователь",
        StatusNow: "active",
      },
      {
        Email: "user8@example.com",
        FirstName: "Ivy",
        SecondName: "Jackson",
        LastName: "Lee",
        Password: "password123",
        PhoneNumber: "901-234-5678",
        Role: "пользователь",
        StatusNow: "active",
      },
      {
        Email: "user9@example.com",
        FirstName: "Jack",
        SecondName: "White",
        LastName: "Perez",
        Password: "password123",
        PhoneNumber: "012-345-6789",
        Role: "пользователь",
        StatusNow: "active",
      },
    ];

    try {
      const existingUsers = await User.count();

      if (existingUsers === 0) {
        await User.bulkCreate(users);
        // await TgUser.bulkCreate();
        console.log("База данных пользователей успешно заполнена.");
      } else {
        console.log(
          "База данных пользователей уже содержит записи. Новые записи не будут добавлены."
        );
      }
    } catch (error) {
      console.error("Ошибка при заполнении базы данных пользователей:", error);
    }
  }
}

module.exports = SeedUsers; // Экспортируем класс
