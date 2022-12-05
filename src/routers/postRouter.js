import express from "express";
import {
  getAddPost,
  getDetailPost,
  getEditPost,
  postAddPost,
  postDeletePost,
  postEditPost,
  postIncreaseViewsPost,
  postToggleLikesPost,
} from "../controllers/postController";
import { loggedInUserOnly } from "../middlewares";

const postRouter = express.Router();

postRouter
  .route("/add")
  .all(loggedInUserOnly)
  .get(getAddPost)
  .post(postAddPost);
postRouter
  .route("/edit/:postId")
  .all(loggedInUserOnly)
  .get(getEditPost)
  .post(postEditPost);
postRouter.post("/delete/:postId", loggedInUserOnly, postDeletePost);
postRouter.get("/detail/:postId", loggedInUserOnly, getDetailPost);
postRouter.post("/increase-views/:postId", postIncreaseViewsPost);
postRouter.post("/toggle-likes/:postId", postToggleLikesPost);

export default postRouter;
