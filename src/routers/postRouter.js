import express from "express";
import { postController } from "../controllers";
import { loginRequired } from "../middlewares";

const postRouter = express.Router();

postRouter
  .route("/add")
  .all(loginRequired)
  .get(postController.getAddPost)
  .post(postController.postAddPost);
postRouter
  .route("/edit/:postId")
  .all(loginRequired)
  .get(postController.getEditPost)
  .post(postController.postEditPost);
postRouter.delete("/delete/:postId", loginRequired, postController.deletePost);
postRouter.get("/detail/:postId", loginRequired, postController.getDetailPost);
postRouter.put(
  "/increase-views/:postId",
  loginRequired,
  postController.increasePostViews
);
postRouter.put(
  "/toggle-likes/:postId",
  loginRequired,
  postController.increasePostLikes
);

export default postRouter;
