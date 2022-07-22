import express from "express";
import { getAddPost, getBoard } from "../controllers/boardController";
import { loggedInUserOnly } from "../middlewares";

const boardRouter = express.Router();

boardRouter.get("/", loggedInUserOnly, getBoard);
boardRouter.get("/add-post", loggedInUserOnly, getAddPost);

export default boardRouter;
