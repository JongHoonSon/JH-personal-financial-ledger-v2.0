import express from "express";
import { commentController } from "../controllers";

const commentRouter = express.Router();

commentRouter.post("/add/:postId", commentController.addComment);

commentRouter
  .route("/:commentId")
  .put(commentController.editComment)
  .delete(commentController.deleteComment);

commentRouter.put(
  "/increase-likes/:commentId",
  commentController.increaseCommentLikes
);

export default commentRouter;
