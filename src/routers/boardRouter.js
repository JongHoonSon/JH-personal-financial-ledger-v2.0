import express from "express";
import {
  getAddPost,
  getBoard,
  postAddPost,
} from "../controllers/boardController";
import { loggedInUserOnly } from "../middlewares";

const boardRouter = express.Router();

boardRouter.get("/", loggedInUserOnly, getBoard);
boardRouter
  .route("/add-post")
  .all(loggedInUserOnly)
  .get(getAddPost)
  .post(postAddPost);

export default boardRouter;
