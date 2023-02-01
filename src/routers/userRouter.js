import express from "express";
import { userController } from "../controllers";
import { imageUploader } from "../middlewares";

const userRouter = express.Router();

userRouter.get("/profile/:userId", userController.getUserProfile);

userRouter
  .route("/edit-profile")
  .get(userController.getEditUserProfile)
  .put(imageUploader.single("image"), userController.editUserProfile);

userRouter
  .route("/edit-password")
  .get(userController.getEditUserPassword)
  .put(userController.editUserPassword);

userRouter
  .route("/category/:categoryType")
  .post(userController.addUserCategory)
  .delete(userController.deleteUserCategory);

userRouter.get("/own-posts/:userId", userController.getUserOwnPosts);

userRouter.get("/own-comments/:userId", userController.getUserOwnComments);

export default userRouter;
