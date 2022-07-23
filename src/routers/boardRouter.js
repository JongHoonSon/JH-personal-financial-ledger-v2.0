import express from "express";
import {
  getAddPost,
  getBoard,
  getEditPost,
  postAddPost,
  postDeletePost,
  postEditPost,
} from "../controllers/boardController";
import { loggedInUserOnly } from "../middlewares";

const boardRouter = express.Router();

boardRouter
  .route("/add-post")
  .all(loggedInUserOnly)
  .get(getAddPost)
  .post(postAddPost);
boardRouter
  .route("/edit-post")
  .all(loggedInUserOnly)
  .get(getEditPost)
  .post(postEditPost);
boardRouter.post("/delete-post", loggedInUserOnly, postDeletePost);
boardRouter.get("/:category", loggedInUserOnly, getBoard);

export default boardRouter;
