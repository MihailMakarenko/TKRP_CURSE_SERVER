const Router = require("express");
const router = new Router();
const taskController = require("../controllers/taskController");
const path = require("path"); // Импортируйте модуль path

router.get("/uploads/tasksPhoto/:photoName", taskController.getPhoto);
router.get("/:id", taskController.getTask);
router.get("/getTasksByCategory/:category", taskController.getTasksByCategory);
router.post("/", taskController.addTask);
router.get("/", taskController.getAll);
router.put("/:id", taskController.updateTaskById);
router.delete("/:id", taskController.deleteTaskById);
router.get(
  "/getTasksByRoomNumber/:roomNumber",
  taskController.getTasksByRoomNumber
);

module.exports = router;
