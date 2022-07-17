import express from "express";
import {
  getEditProfile,
  getProfile,
  postEditProfile,
} from "../controllers/userController";
import { userOnlyMiddleware } from "../middlewares";

const userRouter = express.Router();

userRouter.get("/profile/:userId", getProfile);
userRouter
  .route("/edit-profile/:userId")
  .all(userOnlyMiddleware)
  .get(getEditProfile)
  .post(postEditProfile);

export default userRouter;
