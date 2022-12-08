import express from "express";
import { userController } from "../controllers";
import { loginRequiredPage, imageUploader } from "../middlewares";

const userRouter = express.Router();

userRouter.get("/profile/:userId", userController.getUserProfile);
userRouter
  .route("/edit-profile")
  .all(loginRequiredPage)
  .get(userController.getEditUserProfile)
  .post(imageUploader.single("image"), userController.postEditUserProfile);
userRouter
  .route("/edit-password")
  .all(loginRequiredPage)
  .get(userController.getEditUserPassword)
  .post(userController.postEditUserPassword);
userRouter.get(
  "/own-categories/:categoryType",
  loginRequiredPage,
  userController.getUserOwnCategories
);
userRouter.post(
  "/add/category/:categoryType",
  loginRequiredPage,
  userController.postAddUserCategory
);
userRouter.delete(
  "/delete/category/:categoryType",
  loginRequiredPage,
  userController.postDeleteUserCategory
);
userRouter.get("/own-posts/:userId", userController.getUserOwnPosts);
userRouter.get("/own-comments/:userId", userController.getUserOwnComments);

export default userRouter;
