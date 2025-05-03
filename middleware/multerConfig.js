const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/tasksPhoto");
  },
  filename: function (req, file, cb) {
    // Удаляем пробелы из оригинального имени файла
    const originalNameWithoutSpaces = file.originalname.replace(/\s+/g, "_");

    // Убираем расширение для обрезки
    const ext = path.extname(originalNameWithoutSpaces);
    const nameWithoutExt = originalNameWithoutSpaces.slice(0, 30); // Обрезаем до 50 символов

    // Если длина имени превышает 50 символов, добавляем уникальный суффикс
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);

    // Формируем новое имя файла
    const newFileName = nameWithoutExt + "-" + uniqueSuffix + ext;

    cb(null, newFileName);
  },
});

module.exports = multer({ storage: storage });
