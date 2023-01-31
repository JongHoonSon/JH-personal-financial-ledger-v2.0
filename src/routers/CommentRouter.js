import express from "express";
import { commentController } from "../controllers";

const commentRouter = express.Router();

commentRouter.post("/add/:postId", commentController.addComment);
commentRouter.put(
  "/edit/:commentId",

  commentController.editComment
);
commentRouter.delete(
  "/delete/:postId/:commentId",

  commentController.deleteComment
);
commentRouter.put(
  "/increase-likes/:commentId",

  commentController.increaseCommentLikes
);

export default commentRouter;
