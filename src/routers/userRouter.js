import express from "express";
import { userController } from "../controllers";
import { loggedInUserOnly, uploadFiles } from "../middlewares";

const userRouter = express.Router();

userRouter.get("/profile/:userId", userController.getUserProfile);
userRouter
  .route("/edit-profile")
  .all(loggedInUserOnly)
  .get(userController.getEditUserProfile)
  .post(uploadFiles.single("image"), userController.postEditUserProfile);
userRouter
  .route("/edit-password")
  .all(loggedInUserOnly)
  .get(userController.getEditUserPassword)
  .post(userController.postEditUserPassword);
userRouter.get(
  "/own-categories/:categoryType",
  loggedInUserOnly,
  userController.getUserOwnCategories
);
userRouter.post(
  "/add/category/:categoryType",
  loggedInUserOnly,
  userController.postAddUserCategory
);
userRouter.delete(
  "/delete/category/:categoryType",
  loggedInUserOnly,
  userController.postDeleteUserCategory
);
userRouter.get("/own-posts/:userId", userController.getUserOwnPosts);
userRouter.get("/own-comments/:userId", userController.getUserOwnComments);

export default userRouter;
