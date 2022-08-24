import express from "express";
import {
  getAddUserCategory,
  getEditUserPassword,
  getEditUserProfile,
  getUserCategories,
  getUserOwnComments,
  getUserOwnPosts,
  getUserProfile,
  postAddUserCategory,
  postDeleteUserCategories,
  postEditUserPassword,
  postEditUserProfile,
} from "../controllers/userController";
import { loggedInUserOnly, uploadFiles } from "../middlewares";

const userRouter = express.Router();

userRouter.get("/profile/:userId", getUserProfile);
userRouter
  .route("/edit-profile")
  .all(loggedInUserOnly)
  .get(getEditUserProfile)
  .post(uploadFiles.single("image"), postEditUserProfile);
userRouter
  .route("/edit-password")
  .all(loggedInUserOnly)
  .get(getEditUserPassword)
  .post(postEditUserPassword);
userRouter.get(
  "/categories/:categoryType",
  loggedInUserOnly,
  getUserCategories
);
userRouter
  .route("/add/category/:categoryType")
  .all(loggedInUserOnly)
  .get(getAddUserCategory)
  .post(postAddUserCategory);
userRouter.post(
  "/delete/categories/:categoryType",
  loggedInUserOnly,
  postDeleteUserCategories
);
userRouter.get("/own-posts/:userId", getUserOwnPosts);
userRouter.get("/own-comments/:userId", getUserOwnComments);

export default userRouter;
