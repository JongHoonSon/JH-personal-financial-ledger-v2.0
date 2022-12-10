import express from "express";
import { loginRequired } from "../middlewares";
import { commentController } from "../controllers";

const commentRouter = express.Router();

commentRouter.post(
  "/add/:postId",
  loginRequired,
  commentController.postAddComment
);
commentRouter.post(
  "/edit/:postId/:commentId",
  loginRequired,
  commentController.postEditComment
);
commentRouter.post(
  "/delete/:postId/:commentId",
  loginRequired,
  commentController.postDeleteComment
);
commentRouter.post(
  "/increase-likes/:postId/:commentId",
  loginRequired,
  commentController.postIncreaseLikesComment
);

export default commentRouter;
