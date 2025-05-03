const Router = require("express");
const router = new Router();

const comment = require("./commentRouter");
const historyUser = require("./historyUserRouter");
const location = require("./locationRouter");
const notification = require("./notificationRouter");
const request = require("./requestRouter");
const requestHistory = require("./requestHistoryRouter");
const task = require("./taskRouter");
const user = require("./userRouter");
const tg = require("./tgRouter");

router.use("/comment", comment);
router.use("/historyUser", historyUser); // добавить записи в бд
router.use("/location", location);
router.use("/notification", notification);
router.use("/request", request);
router.use("/requestHistory", requestHistory);
router.use("/task", task);
router.use("/user", user);
router.use("/tg", tg);

module.exports = router;
