const { Sequelize } = require("sequelize");

module.exports = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    dialect: "postgres",
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    // dialectOptions: {
    //   ssl: {
    //     require: true,
    //     rejectUnauthorized: false, // Убедитесь, что это значение безопасно для вашего окружения
    //     // Если есть сертификат, укажите путь к нему
    //     // ca: fs.readFileSync('path/to/server-certificates.crt').toString()
    //   },
    // },
  }
);
