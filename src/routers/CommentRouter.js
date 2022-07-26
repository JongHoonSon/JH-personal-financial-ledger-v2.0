import express from "express";
import { loggedInUserOnly } from "../middlewares";
import { postAddComment } from "../controllers/commentController";

const commentRouter = express.Router();

commentRouter.post("/add/:postId", loggedInUserOnly, postAddComment);

export default commentRouter;
