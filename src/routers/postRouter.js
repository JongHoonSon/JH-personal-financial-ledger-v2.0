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
postRouter.post(
  "/delete/:postId",
  loginRequired,
  postController.postDeletePost
);
postRouter.get("/detail/:postId", loginRequired, postController.getDetailPost);
postRouter.post(
  "/increase-views/:postId",
  loginRequired,
  postController.postIncreaseViewsPost
);
postRouter.post(
  "/toggle-likes/:postId",
  loginRequired,
  postController.postToggleLikesPost
);

export default postRouter;
