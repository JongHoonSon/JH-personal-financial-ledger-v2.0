import express from "express";
import {
  getEditUserPassword,
  getEditUserProfile,
  getUserOwnComments,
  getUserOwnPosts,
  getUserProfile,
  postEditUserPassword,
  postEditUserProfile,
} from "../controllers/userController";
import { loggedInUserOnly, uploadFiles } from "../middlewares";

const userRouter = express.Router();

userRouter.get("/profile/:userId", getUserProfile);
userRouter
  .route("/edit-profile/:userId")
  .all(loggedInUserOnly)
  .get(getEditUserProfile)
  .post(uploadFiles.single("image"), postEditUserProfile);
userRouter
  .route("/edit-password/:userId")
  .all(loggedInUserOnly)
  .get(getEditUserPassword)
  .post(postEditUserPassword);
userRouter.get("/own-posts/:userId", getUserOwnPosts);
userRouter.get("/own-comments/:userId", getUserOwnComments);

export default userRouter;
