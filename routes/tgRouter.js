const Router = require("express");
const router = new Router();
const tgController = require("../controllers/tgController");

router.post("/send-message", tgController.sendMessage);

module.exports = router;
