import express from "express";
import {
  getAddPost,
  getDetailPost,
  getEditPost,
  postAddPost,
  postDeletePost,
  postEditPost,
} from "../controllers/postController";
import { loggedInUserOnly } from "../middlewares";

const postRouter = express.Router();

postRouter
  .route("/add")
  .all(loggedInUserOnly)
  .get(getAddPost)
  .post(postAddPost);
postRouter
  .route("/edit")
  .all(loggedInUserOnly)
  .get(getEditPost)
  .post(postEditPost);
postRouter.post("/delete", loggedInUserOnly, postDeletePost);
postRouter.get("/detail/:postId", loggedInUserOnly, getDetailPost);

export default postRouter;
