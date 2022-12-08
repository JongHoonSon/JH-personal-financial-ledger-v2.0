import express from "express";
import { postController } from "../controllers";
import { checkUserLoggedIn } from "../middlewares";

const postRouter = express.Router();

postRouter
  .route("/add")
  .all(checkUserLoggedIn)
  .get(postController.getAddPost)
  .post(postController.postAddPost);
postRouter
  .route("/edit/:postId")
  .all(checkUserLoggedIn)
  .get(postController.getEditPost)
  .post(postController.postEditPost);
postRouter.post(
  "/delete/:postId",
  checkUserLoggedIn,
  postController.postDeletePost
);
postRouter.get(
  "/detail/:postId",
  checkUserLoggedIn,
  postController.getDetailPost
);
postRouter.post(
  "/increase-views/:postId",
  postController.postIncreaseViewsPost
);
postRouter.post("/toggle-likes/:postId", postController.postToggleLikesPost);

export default postRouter;
