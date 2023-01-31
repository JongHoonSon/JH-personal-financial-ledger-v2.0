import express from "express";
import { userController } from "../controllers";
import { imageUploader } from "../middlewares";

const userRouter = express.Router();

userRouter.get("/profile/:userId", userController.getUserProfile);
userRouter
  .route("/edit-profile")
  .get(userController.getEditUserProfile)
  .post(imageUploader.single("image"), userController.postEditUserProfile);
userRouter
  .route("/edit-password")
  .get(userController.getEditUserPassword)
  .post(userController.postEditUserPassword);
userRouter.get(
  "/own-categories/:categoryType",
  userController.getUserOwnCategories
);
userRouter.post(
  "/add/category/:categoryType",
  userController.postAddUserCategory
);
userRouter.delete(
  "/delete/category/:categoryType",
  userController.postDeleteUserCategory
);
userRouter.get("/own-posts/:userId", userController.getUserOwnPosts);
userRouter.get("/own-comments/:userId", userController.getUserOwnComments);

export default userRouter;
