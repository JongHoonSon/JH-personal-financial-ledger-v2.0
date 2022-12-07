import express from "express";
import { itemController } from "../controllers";
import { loggedInUserOnly, uploadFiles } from "../middlewares";

const itemRouter = express.Router();

itemRouter
  .route("/add/:itemType")
  .all(loggedInUserOnly)
  .get(itemController.getAddItem)
  .post(uploadFiles.single("image"), itemController.postAddItem);
itemRouter
  .route("/edit/:itemType/:itemId")
  .all(loggedInUserOnly)
  .get(itemController.getEditItem)
  .post(uploadFiles.single("image"), itemController.postEditItem);
itemRouter.post(
  "/delete/:itemType/:itemId",
  loggedInUserOnly,
  itemController.postDeleteItem
);
itemRouter.get(
  "/detail/:itemType/:itemId",
  loggedInUserOnly,
  itemController.getDetailItem
);
itemRouter.get("/pinned", loggedInUserOnly, itemController.getPinnedItems);
itemRouter.post(
  "/pinning/:itemType/:itemId",
  loggedInUserOnly,
  itemController.postPinning
);

export default itemRouter;
