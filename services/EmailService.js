const nodemailer = require("nodemailer");
const Host = process.env.REACT_APP_HOST_MAIL;
const Port = process.env.REACT_APP_PORT_MAIL;
const User = process.env.REACT_APP_USER_MAIL;
const Pass = process.env.REACT_APP_PASS_MAIL;

const transporter = nodemailer.createTransport({
  host: "smtp.mail.ru",
  port: Port,
  secure: true,
  auth: {
    user: User, // Ваш адрес Mail.ru
    pass: Pass, // Сгенерированный пароль для приложения
  },
});

const sendPassword = async (email, password) => {
  console.log({
    User: process.env.REACT_APP_USER_MAIL,
    Pass: process.env.REACT_APP_PASS_MAIL,
  });

  const mailOptions = {
    from: process.env.REACT_APP_USER_MAIL,
    to: email,
    subject: "Ваш аккаунт успешно создан",
    text: `Ваш пароль для доступа к аккаунту: ${password}`,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log("Сообщение успешно отправлено", info);

    // Здесь вы можете проверить информацию о доставке
    if (info.accepted.includes(email)) {
      console.log(`Письмо успешно отправлено на ${email}`);
    } else {
      console.warn(`Письмо не было доставлено на ${email}`);
      throw new Error("Не удалось доставить сообщение на указанный адрес");
    }
  } catch (error) {
    console.error("Ошибка при отправке сообщения:", error);
    throw new Error("Ошибка отправки email");
  }
};

module.exports = { sendPassword };

// Функция для отправки уведомлений
// const sendEmailNotification = async (email, trip, route, ticket) => {
//   const mailOptions = {
//     from: "misha.makarenko2004@mail.ru", // Тот же адрес, что и в auth
//     to: email,
//     subject: "Ваш автобус скоро отправляется",
//     // text: `${ticket.TicketId}`,
//     text: `Ваш автобус по маршруту ${route.StartCity} - ${
//       route.FinishCity
//     }, отправляется сегодня в ${
//       trip.StartTime
//     }, ваши места: ${ticket.Seats.join(", ")}`,
//   };

//   try {
//     await transporter.sendMail(mailOptions);
//     console.log("Сообщение успешно отправлено");
//   } catch (error) {
//     console.error("Ошибка при отправке сообщения:", error.message);
//   }
// };

// const startSendingEmails = async (date) => {
//   console.log("AAAA");
//   try {
//     const formattedDate = date.toISOString().split("T")[0];
//     console.log(formattedDate);

//     // Получаем записи по заданной дате
//     const registerBooks = await RegisterBookService.getRigisterBookByDate(
//       formattedDate
//     );

//     console.log(registerBooks);

//     // Проходим по всем записям и их билетам
//     for (const registerBook of registerBooks) {
//       const trip = await Trip.findByPk(registerBook.TripId);
//       const route = await Route.findByPk(trip.RouteId);
//       console.log(route);
//       for (const ticket of registerBook.tickets) {
//         const user = await User.findByPk(ticket.UserId);

//         // Шаг 3: Отправляем сообщение пользователю
//         await sendEmailNotification(user.Email, trip, route, ticket);

//         // Шаг 4: Обновляем запись о билете, что уведомление отправлено
//         await Tickets.update(
//           { NotificationSent: true },
//           { where: { TicketId: ticket.TicketId } }
//         );
//       }
//     }
//   } catch (error) {
//     console.error("Ошибка при уведомлении пользователей:", error);
//   }
// };

// const scheduleEmailSending = () => {
//   console.log("VVV");
//   setInterval(async () => {
//     await startSendingEmails(new Date());
//   }, 10000); // Интервал в миллисекундах
// };

// const sendNewsletter = async (header, mainText) => {
//   try {
//     // Получаем список email-адресов пользователей, подписанных на рассылку
//     const emails = await UserService.getEmailUserWhoGetNewsletter();

//     // Отправляем уведомления всем пользователям
//     for (const email of emails) {
//       const mailOptions = {
//         from: "misha.makarenko2004@mail.ru", // От кого
//         to: email, // Кому
//         subject: header, // Тема письма
//         text: mainText, // Текст письма
//       };

//       try {
//         // Отправка почты
//         await transporter.sendMail(mailOptions);
//         console.log(`Уведомление отправлено на ${email}`);
//       } catch (sendError) {
//         console.error(
//           `Ошибка при отправке уведомления на ${email}:`,
//           sendError.message
//         );
//         // Здесь можно добавить дополнительную логику, если нужно
//       }
//     }
//   } catch (error) {
//     console.error("Ошибка при получении email-адресов пользователей:", error);
//   }
// };
