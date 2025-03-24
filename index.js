require("dotenv").config();
const express = require("express"); //импорт модуля
const cors = require("cors");
const router = require("./routes/indexRouter.js");
const swaggerUi = require("swagger-ui-express");
const YAML = require("yamljs");
const path = require("path");
const seedDatabase = require("./seed/seedDatabase.js");
// const passport = require("passport");

const PORT = process.env.PORT; //порт, на котором работает сервер

// Загружаем спецификацию Swagger

const app = express(); //создаем объект express
const swaggerDocument = YAML.load(path.join(__dirname, "swagger.yaml"));

// Настраиваем Swagger
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.use(cors());
app.use(express.json());
app.use(express.static("uploads"));
app.use("/api", router);
// app.use(passport.initialize());
// require("./middleware/passport")(passport);

const start = async () => {
  try {
    await seedDatabase();

    app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
  } catch (e) {
    console.log(e);
  }
};

start();
