import express from "express";
import { commentController } from "../controllers";
import checkCommentExist from "../middlewares/comment/checkCommentExist";
import checkPostExist from "../middlewares/post/checkPostExist";

const commentRouter = express.Router();

commentRouter.post(
  "/add/:postId",
  checkPostExist,
  commentController.addComment
);

commentRouter
  .route("/:commentId")
  .all(checkCommentExist)
  .put(commentController.editComment)
  .delete(commentController.deleteComment);

commentRouter.put(
  "/increase-likes/:commentId",
  checkCommentExist,
  commentController.increaseCommentLikes
);

export default commentRouter;
