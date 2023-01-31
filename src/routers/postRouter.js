import express from "express";
import { postController } from "../controllers";

const postRouter = express.Router();

postRouter.get("/add", postController.getAddPost);
postRouter.post("/", postController.addPost);
postRouter.get("/edit/:postId", postController.getEditPost);
postRouter
  .route("/:postId")
  .get(postController.getDetailPost)
  .put(postController.editPost)
  .delete(postController.deletePost);
postRouter.put(
  "/increase-views/:postId",

  postController.increasePostViews
);
postRouter.put(
  "/toggle-likes/:postId",

  postController.togglePostLikes
);

export default postRouter;
