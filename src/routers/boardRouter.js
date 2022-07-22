import express from "express";
import { getAddWriting, getBoard } from "../controllers/boardController";
import { loggedInUserOnly } from "../middlewares";

const boardRouter = express.Router();

boardRouter.get("/", loggedInUserOnly, getBoard);
boardRouter.get("/add-writing", loggedInUserOnly, getAddWriting);

export default boardRouter;
