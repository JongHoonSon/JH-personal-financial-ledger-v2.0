import express from "express";
import { boardController } from "../controllers";

const boardRouter = express.Router();

boardRouter.get("/:boardName/:pageNum", boardController.getBoard);

export default boardRouter;
