const Router = require("express");
const router = new Router();
const requestController = require("../controllers/requestController");
const authenticateToken = require("../middleware/passport");

router.get(
  "/getAll",
  authenticateToken,
  requestController.getRequestByUserWidthPagination
);
router.get(
  "/getRequestsByUserId/:userId",

  requestController.getRequestsByUserId
);
router.post("/", requestController.addRequest);
router.get("/", requestController.getAll);
router.put("/:id", requestController.updateRequestById);
router.delete("/:id", requestController.deleteRequestById);
router.get("/date-range", requestController.getRequestsByDateRange);

module.exports = router;
