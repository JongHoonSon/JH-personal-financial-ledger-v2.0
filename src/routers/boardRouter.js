import express from "express";
import { getBoard } from "../controllers/boardController";
import { loggedInUserOnly } from "../middlewares";

const boardRouter = express.Router();

boardRouter.get("/", loggedInUserOnly, getBoard);

export default boardRouter;
