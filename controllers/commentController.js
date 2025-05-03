const CommentService = require("../services/CommentService");

class CommentController {
  // Создать новый комментарий
  async createComment(req, res) {
    console.log("Мы тут");
    const { RequestId, Text } = req.body;
    const UserId = req.user.id;
    try {
      const DateTime = new Date(); // Получаем текущее время
      const newComment = await CommentService.createComment({
        Text,
        DateTime,
        UserId,
        RequestId,
      });
      res.status(201).json(newComment);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }

  // Получить все комментарии
  async getAll(req, res) {
    try {
      const comments = await CommentService.getAllComments();
      res.status(200).json(comments);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  // Обновить комментарий по ID
  async updateCommentById(req, res) {
    const { id } = req.params;
    const { Text, DateTime, UserId, RequestId } = req.body;
    try {
      const updatedComment = await CommentService.updateCommentById(id, {
        Text,
        DateTime,
        UserId,
        RequestId,
      });
      res.status(200).json(updatedComment);
    } catch (error) {
      if (error.message === "Комментарий не найден") {
        return res.status(404).json({ message: error.message });
      }
      res.status(400).json({ message: error.message });
    }
  }

  // Удалить комментарий по ID
  async deleteCommentById(req, res) {
    const { id } = req.params;
    try {
      await CommentService.deleteCommentById(id);
      res.status(204).send(); // Успешное удаление
    } catch (error) {
      if (error.message === "Комментарий не найден") {
        return res.status(404).json({ message: error.message });
      }
      res.status(500).json({ message: error.message });
    }
  }

  // Получить все комментарии пользователя по его UserId
  async getCommentsByUserId(req, res) {
    const { userId } = req.params;
    try {
      const comments = await CommentService.getCommentsByUserId(userId);
      res.status(200).json(comments);
    } catch (error) {
      res.status(404).json({ message: error.message });
    }
  }

  // Получить все комментарии по RequestId
  async getCommentsByRequestId(req, res) {
    const { requestId } = req.params;
    try {
      const comments = await CommentService.getCommentsByRequestId(requestId);
      res.status(200).json(comments);
    } catch (error) {
      res.status(404).json({ message: error.message });
    }
  }

  async getCommentById(req, res) {
    const { commentId } = req.params;
    if (!commentId) {
      return res.status(400).json({ message: "Необходимо указать CommentId" });
    }
    try {
      const comment = await CommentService.getCommentById(commentId);
      res.status(200).json(comment);
    } catch (error) {
      res.status(404).json({ message: error.message });
    }
  }
}

module.exports = new CommentController();
