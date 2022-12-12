import express from "express";
import { userController } from "../controllers";
import { loginRequired, imageUploader } from "../middlewares";

const userRouter = express.Router();

userRouter.get(
  "/profile/:userId",
  loginRequired,
  userController.getUserProfile
);
userRouter
  .route("/edit-profile")
  .all(loginRequired)
  .get(userController.getEditUserProfile)
  .post(imageUploader.single("image"), userController.postEditUserProfile);
userRouter
  .route("/edit-password")
  .all(loginRequired)
  .get(userController.getEditUserPassword)
  .post(userController.postEditUserPassword);
userRouter.get(
  "/own-categories/:categoryType",
  loginRequired,
  userController.getUserOwnCategories
);
userRouter.post(
  "/add/category/:categoryType",
  loginRequired,
  userController.postAddUserCategory
);
userRouter.delete(
  "/delete/category/:categoryType",
  loginRequired,
  userController.postDeleteUserCategory
);
userRouter.get(
  "/own-posts/:userId",
  loginRequired,
  userController.getUserOwnPosts
);
userRouter.get(
  "/own-comments/:userId",
  loginRequired,
  userController.getUserOwnComments
);

export default userRouter;
