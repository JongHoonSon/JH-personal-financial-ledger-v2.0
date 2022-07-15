import express from "express";
import {
  getEditProfile,
  getProfile,
  postEditProfile,
} from "../controllers/userController";

const userRouter = express.Router();

userRouter.get("/profile/:userId", getProfile);
userRouter
  .route("/edit-profile/:userId")
  .get(getEditProfile)
  .post(postEditProfile);

export default userRouter;
