import express from "express";
import { itemController } from "../controllers";
import { loginRequired, imageUploader } from "../middlewares";

const itemRouter = express.Router();

itemRouter
  .route("/add/:itemType")
  .all(loginRequired)
  .get(itemController.getAddItem)
  .post(imageUploader.single("image"), itemController.addItem);
itemRouter
  .route("/edit/:itemType/:itemId")
  .all(loginRequired)
  .get(itemController.getEditItem)
  .post(imageUploader.single("image"), itemController.editItem);
itemRouter.delete(
  "/delete/:itemType/:itemId",
  loginRequired,
  itemController.deleteItem
);
itemRouter.get(
  "/detail/:itemType/:itemId",
  loginRequired,
  itemController.getDetailItem
);
itemRouter.get("/pinned", loginRequired, itemController.getPinnedItems);
itemRouter.put("/pin/:itemType/:itemId", loginRequired, itemController.pinItem);

export default itemRouter;
