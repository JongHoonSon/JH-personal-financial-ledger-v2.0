import express from "express";
import { loginRequired } from "../middlewares";
import { commentController } from "../controllers";

const commentRouter = express.Router();

commentRouter.post("/add/:postId", loginRequired, commentController.addComment);
commentRouter.put(
  "/edit/:commentId",
  loginRequired,
  commentController.editComment
);
commentRouter.delete(
  "/delete/:postId/:commentId",
  loginRequired,
  commentController.deleteComment
);
commentRouter.put(
  "/increase-likes/:commentId",
  loginRequired,
  commentController.increaseCommentLikes
);

export default commentRouter;
