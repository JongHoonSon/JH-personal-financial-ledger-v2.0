import express from "express";
import {
  getEditProfile,
  getProfile,
  postEditProfile,
} from "../controllers/userController";

const userRouter = express.Router();

userRouter.get("/profile", getProfile);
userRouter.route("/edit-profile").get(getEditProfile).post(postEditProfile);

export default userRouter;
