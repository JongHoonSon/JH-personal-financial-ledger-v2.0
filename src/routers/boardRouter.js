import express from "express";
import { boardController } from "../controllers";
import { loggedInUserOnly } from "../middlewares";

const boardRouter = express.Router();

boardRouter.get(
  "/:boardName/:pageNum",
  loggedInUserOnly,
  boardController.getBoard
);

export default boardRouter;
