import express from "express";
import { loggedInUserOnly } from "../middlewares";
import {
  postAddComment,
  postDeleteComment,
  postEditComment,
  postIncreaseLikesComment,
} from "../controllers/commentController";

const commentRouter = express.Router();

commentRouter.post("/add/:postId", loggedInUserOnly, postAddComment);
commentRouter.post(
  "/edit/:postId/:commentId",
  loggedInUserOnly,
  postEditComment
);
commentRouter.post(
  "/delete/:postId/:commentId",
  loggedInUserOnly,
  postDeleteComment
);
commentRouter.post(
  "/increase-likes/:postId/:commentId",
  postIncreaseLikesComment
);

export default commentRouter;
