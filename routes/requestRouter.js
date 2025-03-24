const Router = require("express");
const router = new Router();
const requestController = require("../controllers/requestController");

router.get("/getAll", requestController.getRequestByUserWidthPagination);
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
