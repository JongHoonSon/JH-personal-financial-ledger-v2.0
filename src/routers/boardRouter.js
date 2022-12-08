import express from "express";
import { boardController } from "../controllers";
import { loginRequiredPage } from "../middlewares";

const boardRouter = express.Router();

boardRouter.get(
  "/:boardName/:pageNum",
  loginRequiredPage,
  boardController.getBoard
);

export default boardRouter;
