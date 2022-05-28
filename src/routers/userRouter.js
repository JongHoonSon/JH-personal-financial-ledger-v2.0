import express from "express";
import {
  getUserEditProfile,
  getUserProfile,
  postUserEditProfile,
} from "../controllers/userController";

const userRouter = express.Router();

userRouter.get("/profile", getUserProfile);
userRouter
  .route("/edit-profile")
  .get(getUserEditProfile)
  .post(postUserEditProfile);

export default userRouter;