import express from "express";
import { postController } from "../controllers";
import checkPostExist from "./../middlewares/post/checkPostExist";

const postRouter = express.Router();

postRouter.get("/add", postController.getAddPost);

postRouter.post("/", postController.addPost);

postRouter.get("/edit/:postId", checkPostExist, postController.getEditPost);

postRouter
  .route("/:postId")
  .all(checkPostExist)
  .get(postController.getDetailPost)
  .put(postController.editPost)
  .delete(postController.deletePost);

postRouter.put(
  "/increase-views/:postId",
  checkPostExist,
  postController.increasePostViews
);

postRouter.put(
  "/toggle-likes/:postId",
  checkPostExist,
  postController.togglePostLikes
);

export default postRouter;
