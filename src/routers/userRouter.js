import express from "express";
import {
  getEditProfile,
  getProfile,
  postEditProfile,
} from "../controllers/userController";
import { loggedInUserOnly } from "../middlewares";

const userRouter = express.Router();

userRouter.get("/profile/:userId", getProfile);
userRouter
  .route("/edit-profile/:userId")
  .all(loggedInUserOnly)
  .get(getEditProfile)
  .post(postEditProfile);

export default userRouter;
