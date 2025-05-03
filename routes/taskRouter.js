const Router = require("express");
const router = new Router();
const taskController = require("../controllers/taskController");
const path = require("path"); // Импортируйте модуль path
const upload = require("../middleware/multerConfig");
const authenticateToken = require("../middleware/passport");

router.get("/uploads/tasksPhoto/:photoName", taskController.getPhoto);
router.post(
  "/addRequest",
  upload.single("photo"),
  authenticateToken,
  taskController.createTask
);
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
