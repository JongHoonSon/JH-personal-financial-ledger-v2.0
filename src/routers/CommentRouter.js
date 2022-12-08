import express from "express";
import { checkUserLoggedIn } from "../middlewares";
import { commentController } from "../controllers";

const commentRouter = express.Router();

commentRouter.post(
  "/add/:postId",
  checkUserLoggedIn,
  commentController.postAddComment
);
commentRouter.post(
  "/edit/:postId/:commentId",
  checkUserLoggedIn,
  commentController.postEditComment
);
commentRouter.post(
  "/delete/:postId/:commentId",
  checkUserLoggedIn,
  commentController.postDeleteComment
);
commentRouter.post(
  "/increase-likes/:postId/:commentId",
  commentController.postIncreaseLikesComment
);

export default commentRouter;
