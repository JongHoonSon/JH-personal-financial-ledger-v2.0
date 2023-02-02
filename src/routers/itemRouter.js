import express from "express";
import { itemController } from "../controllers";
import { imageUploader } from "../middlewares";
import checkItemExist from "./../middlewares/item/checkItemExist";

const itemRouter = express.Router();

itemRouter.get("/add/:itemType", itemController.getAddItem);

itemRouter.post(
  "/:itemType",
  imageUploader.single("image"),
  itemController.addItem
);

itemRouter.get(
  "/edit/:itemType/:itemId",
  checkItemExist,
  itemController.getEditItem
);

itemRouter
  .route("/:itemType/:itemId")
  .all(checkItemExist)
  .get(itemController.getDetailItem)
  .put(imageUploader.single("image"), itemController.editItem)
  .delete(itemController.deleteItem);

itemRouter.get("/pinned", itemController.getPinnedItems);

itemRouter.put(
  "/pin/:itemType/:itemId",
  checkItemExist,
  itemController.pinItem
);

export default itemRouter;
