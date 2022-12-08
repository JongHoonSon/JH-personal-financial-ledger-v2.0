import express from "express";
import { postController } from "../controllers";
import { loginRequiredPage } from "../middlewares";

const postRouter = express.Router();

postRouter
  .route("/add")
  .all(loginRequiredPage)
  .get(postController.getAddPost)
  .post(postController.postAddPost);
postRouter
  .route("/edit/:postId")
  .all(loginRequiredPage)
  .get(postController.getEditPost)
  .post(postController.postEditPost);
postRouter.post(
  "/delete/:postId",
  loginRequiredPage,
  postController.postDeletePost
);
postRouter.get(
  "/detail/:postId",
  loginRequiredPage,
  postController.getDetailPost
);
postRouter.post(
  "/increase-views/:postId",
  postController.postIncreaseViewsPost
);
postRouter.post("/toggle-likes/:postId", postController.postToggleLikesPost);

export default postRouter;
