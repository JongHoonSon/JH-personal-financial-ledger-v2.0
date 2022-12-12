import express from "express";
import { itemController } from "../controllers";
import { loginRequired, imageUploader } from "../middlewares";

const itemRouter = express.Router();

itemRouter
  .route("/add/:itemType")
  .all(loginRequired)
  .get(itemController.getAddItem)
  .post(imageUploader.single("image"), itemController.postAddItem);
itemRouter
  .route("/edit/:itemType/:itemId")
  .all(loginRequired)
  .get(itemController.getEditItem)
  .post(imageUploader.single("image"), itemController.postEditItem);
itemRouter.post(
  "/delete/:itemType/:itemId",
  loginRequired,
  itemController.postDeleteItem
);
itemRouter.get(
  "/detail/:itemType/:itemId",
  loginRequired,
  itemController.getDetailItem
);
itemRouter.get("/pinned", loginRequired, itemController.getPinnedItems);
itemRouter.post(
  "/pinning/:itemType/:itemId",
  loginRequired,
  itemController.postPinning
);

export default itemRouter;
