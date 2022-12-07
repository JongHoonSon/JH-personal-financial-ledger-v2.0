import express from "express";
import { postController } from "../controllers";
import { loggedInUserOnly } from "../middlewares";

const postRouter = express.Router();

postRouter
  .route("/add")
  .all(loggedInUserOnly)
  .get(postController.getAddPost)
  .post(postController.postAddPost);
postRouter
  .route("/edit/:postId")
  .all(loggedInUserOnly)
  .get(postController.getEditPost)
  .post(postController.postEditPost);
postRouter.post(
  "/delete/:postId",
  loggedInUserOnly,
  postController.postDeletePost
);
postRouter.get(
  "/detail/:postId",
  loggedInUserOnly,
  postController.getDetailPost
);
postRouter.post(
  "/increase-views/:postId",
  postController.postIncreaseViewsPost
);
postRouter.post("/toggle-likes/:postId", postController.postToggleLikesPost);

export default postRouter;
