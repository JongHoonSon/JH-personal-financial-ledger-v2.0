import express from "express";
import { postController } from "../controllers";
import { loginRequired } from "../middlewares";

const postRouter = express.Router();

postRouter.get("/add", loginRequired, postController.getAddPost);
postRouter.post("/", loginRequired, postController.addPost);
postRouter.get("/edit/:postId", loginRequired, postController.getEditPost);
postRouter
  .route("/:postId")
  .get(loginRequired, postController.getDetailPost)
  .put(loginRequired, postController.editPost)
  .delete(loginRequired, postController.deletePost);
postRouter.put(
  "/increase-views/:postId",
  loginRequired,
  postController.increasePostViews
);
postRouter.put(
  "/toggle-likes/:postId",
  loginRequired,
  postController.togglePostLikes
);

export default postRouter;
