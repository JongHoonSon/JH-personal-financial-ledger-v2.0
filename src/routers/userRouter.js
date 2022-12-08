import express from "express";
import { userController } from "../controllers";
import { checkUserLoggedIn, imageUploader } from "../middlewares";

const userRouter = express.Router();

userRouter.get("/profile/:userId", userController.getUserProfile);
userRouter
  .route("/edit-profile")
  .all(checkUserLoggedIn)
  .get(userController.getEditUserProfile)
  .post(imageUploader.single("image"), userController.postEditUserProfile);
userRouter
  .route("/edit-password")
  .all(checkUserLoggedIn)
  .get(userController.getEditUserPassword)
  .post(userController.postEditUserPassword);
userRouter.get(
  "/own-categories/:categoryType",
  checkUserLoggedIn,
  userController.getUserOwnCategories
);
userRouter.post(
  "/add/category/:categoryType",
  checkUserLoggedIn,
  userController.postAddUserCategory
);
userRouter.delete(
  "/delete/category/:categoryType",
  checkUserLoggedIn,
  userController.postDeleteUserCategory
);
userRouter.get("/own-posts/:userId", userController.getUserOwnPosts);
userRouter.get("/own-comments/:userId", userController.getUserOwnComments);

export default userRouter;
