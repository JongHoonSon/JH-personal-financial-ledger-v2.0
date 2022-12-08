import express from "express";
import { itemController } from "../controllers";
import { loginRequiredPage, imageUploader } from "../middlewares";

const itemRouter = express.Router();

itemRouter
  .route("/add/:itemType")
  .all(loginRequiredPage)
  .get(itemController.getAddItem)
  .post(imageUploader.single("image"), itemController.postAddItem);
itemRouter
  .route("/edit/:itemType/:itemId")
  .all(loginRequiredPage)
  .get(itemController.getEditItem)
  .post(imageUploader.single("image"), itemController.postEditItem);
itemRouter.post(
  "/delete/:itemType/:itemId",
  loginRequiredPage,
  itemController.postDeleteItem
);
itemRouter.get(
  "/detail/:itemType/:itemId",
  loginRequiredPage,
  itemController.getDetailItem
);
itemRouter.get("/pinned", loginRequiredPage, itemController.getPinnedItems);
itemRouter.post(
  "/pinning/:itemType/:itemId",
  loginRequiredPage,
  itemController.postPinning
);

export default itemRouter;
