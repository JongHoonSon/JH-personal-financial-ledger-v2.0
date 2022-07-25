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

boardRouter.get("/:category", loggedInUserOnly, getBoard);

export default boardRouter;
