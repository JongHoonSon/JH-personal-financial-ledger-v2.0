import express from "express";
import { itemController } from "../controllers";
import { imageUploader } from "../middlewares";

const itemRouter = express.Router();

itemRouter.get("/add/:itemType", itemController.getAddItem);

itemRouter.post(
  "/:itemType",
  imageUploader.single("image"),
  itemController.addItem
);

itemRouter.get("/edit/:itemType/:itemId", itemController.getEditItem);

itemRouter
  .route("/:itemType/:itemId")
  .get(itemController.getDetailItem)
  .put(imageUploader.single("image"), itemController.editItem)
  .delete(itemController.deleteItem);

itemRouter.get("/pinned", itemController.getPinnedItems);

itemRouter.put("/pin/:itemType/:itemId", itemController.pinItem);

export default itemRouter;
