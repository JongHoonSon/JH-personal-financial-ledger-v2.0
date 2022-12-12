import express from "express";
import { boardController } from "../controllers";
import { loginRequired } from "../middlewares";

const boardRouter = express.Router();

boardRouter.get(
  "/:boardName/:pageNum",
  loginRequired,
  boardController.getBoard
);

export default boardRouter;
