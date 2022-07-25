import express from "express";
import {
  getAddPost,
  getEditPost,
  postAddPost,
  postDeletePost,
  postEditPost,
} from "../controllers/postController";
import { loggedInUserOnly } from "../middlewares";

const postRouter = express.Router();

postRouter
  .route("/add-post")
  .all(loggedInUserOnly)
  .get(getAddPost)
  .post(postAddPost);
postRouter
  .route("/edit-post")
  .all(loggedInUserOnly)
  .get(getEditPost)
  .post(postEditPost);
postRouter.post("/delete-post", loggedInUserOnly, postDeletePost);

export default postRouter;
