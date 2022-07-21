import express from "express";
import {
  getEditPassword,
  getEditProfile,
  getProfile,
  postEditPassword,
  postEditProfile,
} from "../controllers/userController";
import { loggedInUserOnly, uploadFiles } from "../middlewares";

const userRouter = express.Router();

userRouter.get("/profile/:userId", getProfile);
userRouter
  .route("/edit-profile/:userId")
  .all(loggedInUserOnly)
  .get(getEditProfile)
  .post(uploadFiles.single("image"), postEditProfile);
userRouter
  .route("/edit-password/:userId")
  .all(loggedInUserOnly)
  .get(getEditPassword)
  .post(postEditPassword);

export default userRouter;
