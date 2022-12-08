import express from "express";
import { loginRequiredPage } from "../middlewares";
import { commentController } from "../controllers";

const commentRouter = express.Router();

commentRouter.post(
  "/add/:postId",
  loginRequiredPage,
  commentController.postAddComment
);
commentRouter.post(
  "/edit/:postId/:commentId",
  loginRequiredPage,
  commentController.postEditComment
);
commentRouter.post(
  "/delete/:postId/:commentId",
  loginRequiredPage,
  commentController.postDeleteComment
);
commentRouter.post(
  "/increase-likes/:postId/:commentId",
  commentController.postIncreaseLikesComment
);

export default commentRouter;
