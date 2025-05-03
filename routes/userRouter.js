const Router = require("express");
const router = new Router();
const upload = require("../middleware/multerConfigUser");
const userController = require("../controllers/userController");
const authenticateToken = require("../middleware/passport");

router.post("/login", userController.login);
router.patch(
  "/update",
  authenticateToken,
  upload.single("photo"),
  userController.updateUser
);
router.patch("/deactivateUser/:userId", userController.deactivateUser);
router.delete("/not-activated", userController.deleteNotActivatedUsers);
router.get("/generatePdf", userController.GetPdfReport);
router.get("/generateUserHistoryPdf/:userId", userController.getUserHistoryPdf);
router.get("/getUserWithPagination", userController.getUserWithPagination);
router.post("/addChatIdTg", authenticateToken, userController.addChatIdTg);
router.get("/uploads/userPhoto/:photoName", userController.getPhoto);
router.post("/forgot-password", userController.forgotPassword);
router.get("/getUserById/:id", userController.getUserById);
router.post("/", userController.registration);
router.get("/", userController.getAll);
router.put("/:id", userController.updateUserById);
router.delete("/:id", userController.deleteUserById);

module.exports = router;

// const Router = require("express");
// const router = new Router();
// const userController = require("../controllers/userController");
// const passport = require("passport");
// const roleCheck = require("../middleware/roleCheck");

// router.get("/login", userController.login);
// // 1. Создание нового пользователя
// router.post("/", userController.createUser);

// // 2. получение всех пользователей
// router.get(
//   "/",
//   passport.authenticate("jwt", { session: false }),
//   roleCheck("admin"),
//   userController.getAllUsers
// );

// // 3. Получение пользователя по id
// router.get("/:id", userController.getUserById);

// // 4. Обновление пользователя
// router.put("/:id", userController.updateUser); // Обновление по ID

// // 5. Удаление пользователя
// router.delete("/:id", userController.deleteUser); // Удаление по ID

// module.exports = router;
