import express from "express";
import { boardController } from "../controllers";

export const boardRouter = express.Router();

boardRouter.get("/:boardName/:pageNum", boardController.getBoard);
