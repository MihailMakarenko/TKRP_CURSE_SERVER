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

const resendPassword = async (email, password) => {
  console.log({
    User: process.env.REACT_APP_USER_MAIL,
    Pass: process.env.REACT_APP_PASS_MAIL,
  });

  const mailOptions = {
    from: process.env.REACT_APP_USER_MAIL,
    to: email,
    subject: "Восстановление пароля",
    text: `Ваш новый пароль для доступа к аккаунту: ${password}`,
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

module.exports = { sendPassword, resendPassword };
