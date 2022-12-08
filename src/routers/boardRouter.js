import express from "express";
import { boardController } from "../controllers";
import { checkUserLoggedIn } from "../middlewares";

const boardRouter = express.Router();

boardRouter.get(
  "/:boardName/:pageNum",
  checkUserLoggedIn,
  boardController.getBoard
);

export default boardRouter;
