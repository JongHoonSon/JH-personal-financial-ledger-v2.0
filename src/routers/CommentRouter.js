import express from "express";
import { loggedInUserOnly } from "../middlewares";
import { commentController } from "../controllers";

const commentRouter = express.Router();

commentRouter.post(
  "/add/:postId",
  loggedInUserOnly,
  commentController.postAddComment
);
commentRouter.post(
  "/edit/:postId/:commentId",
  loggedInUserOnly,
  commentController.postEditComment
);
commentRouter.post(
  "/delete/:postId/:commentId",
  loggedInUserOnly,
  commentController.postDeleteComment
);
commentRouter.post(
  "/increase-likes/:postId/:commentId",
  commentController.postIncreaseLikesComment
);

export default commentRouter;
