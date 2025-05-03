const Router = require("express");
const router = new Router();
const commentController = require("../controllers/commentController");
const authenticateToken = require("../middleware/passport");

router.get("/getCommentById/:commentId", commentController.getCommentById);
router.post("/", authenticateToken, commentController.createComment);
router.get("/", commentController.getAll);
router.put("/:id", commentController.updateCommentById);
router.delete("/:id", commentController.deleteCommentById);
router.get(
  "/getCommentsByUserId/:userId",
  commentController.getCommentsByUserId
);

router.get(
  "/getCommentsByRequestId/:requestId",
  commentController.getCommentsByRequestId
);

module.exports = router;
