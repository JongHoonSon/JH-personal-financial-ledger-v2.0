import express from "express";
import { itemController } from "../controllers";
import { imageUploader } from "../middlewares";

const itemRouter = express.Router();

itemRouter
  .route("/add/:itemType")
  .get(itemController.getAddItem)
  .post(imageUploader.single("image"), itemController.addItem);
itemRouter
  .route("/edit/:itemType/:itemId")
  .get(itemController.getEditItem)
  .post(imageUploader.single("image"), itemController.editItem);
itemRouter.delete("/delete/:itemType/:itemId", itemController.deleteItem);
itemRouter.get("/detail/:itemType/:itemId", itemController.getDetailItem);
itemRouter.get("/pinned", itemController.getPinnedItems);
itemRouter.put("/pin/:itemType/:itemId", itemController.pinItem);

export default itemRouter;
