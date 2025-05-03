require("dotenv").config();
const express = require("express"); //импорт модуля
const cors = require("cors");
const router = require("./routes/indexRouter.js");
const swaggerUi = require("swagger-ui-express");
const YAML = require("yamljs");
const path = require("path");
const seedDatabase = require("./seed/seedDatabase.js");
// const TELEGRAM_BOT_TOKEN = "7546897650:AAGlP7BudF_vSU0XnyCEZXDuHGUuRl71s_A";
// const CHAT_ID = "5037655460"; // Это можно использовать, если нужно отправлять сообщения напрямую
// // const passport = require("passport");

// const TelegramBot = require("node-telegram-bot-api");

// // Замените на ваш токен бота
// const token = "7546897650:AAGlP7BudF_vSU0XnyCEZXDuHGUuRl71s_A";
// const bot = new TelegramBot(token, { polling: true });

const PORT = process.env.PORT; //порт, на котором работает сервер

// bot.onText(/\/start/, (msg) => {
//   const chatId = msg.chat.id;

//   const inlineKeyboard = {
//     reply_markup: {
//       inline_keyboard: [
//         [
//           {
//             text: "Кнопка 1",
//             callback_data: "button1", // Данные, отправляемые обратно боту при нажатии кнопки
//           },
//           {
//             text: "Кнопка 2",
//             callback_data: "button2",
//           },
//         ],
//       ],
//     },
//   };

//   bot.sendMessage(chatId, "Добро пожаловать! Выберите опцию:", inlineKeyboard);
// });

// // Обработка нажатий кнопок
// bot.on("callback_query", (callbackQuery) => {
//   const message = callbackQuery.message;
//   const data = callbackQuery.data;

//   if (data === "button1") {
//     bot.sendMessage(message.chat.id, "Вы нажали Кнопку 1!");
//   } else if (data === "button2") {
//     bot.sendMessage(message.chat.id, "Вы нажали Кнопку 2!");
//   }
// });

// bot.onText(/\/menu/, (msg) => {
//   const chatId = msg.chat.id;

//   const replyKeyboard = {
//     reply_markup: {
//       keyboard: [
//         ["Опция 1", "Опция 2"], // Ряд 1
//         ["Опция 3", "Опция 4"], // Ряд 2
//       ],
//       one_time_keyboard: true, // Скрыть клавиатуру после нажатия кнопки
//     },
//   };

//   bot.sendMessage(chatId, "Выберите опцию:", replyKeyboard);
// });

// // Обработка нажатий кнопок ответа
// bot.on("message", (msg) => {
//   const chatId = msg.chat.id;

//   if (msg.text === "Опция 1") {
//     bot.sendMessage(chatId, "Вы выбрали Опцию 1!");
//   } else if (msg.text === "Опция 2") {
//     bot.sendMessage(chatId, "Вы выбрали Опцию 2!");
//   }
// });

// Загружаем спецификацию Swagger

const app = express(); //создаем объект express
const swaggerDocument = YAML.load(path.join(__dirname, "swagger.yaml"));

// Настраиваем Swagger
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.use(cors());
app.use(express.json());
app.use(express.static("uploads"));
app.use("/api", router);

// app.use(passport.initiali
// ze());
// require("./middleware/passport")(passport);

const start = async () => {
  try {
    await seedDatabase();

    app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
    // await setWebhook();
  } catch (e) {
    console.log(e);
  }
};

start();
