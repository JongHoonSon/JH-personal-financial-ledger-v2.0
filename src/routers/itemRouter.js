import express from "express";
import {
  getDetailItem,
  getEditItem,
  getPinnedItems,
  postPinning,
  postDeleteItem,
  postDeleteItems,
  postEditItem,
  postAddItem,
  getAddItem,
} from "../controllers/itemController";
import { loggedInUserOnly, uploadFiles } from "../middlewares";

const itemRouter = express.Router();

itemRouter
  .route("/add/:itemType")
  .all(loggedInUserOnly)
  .get(getAddItem)
  .post(uploadFiles.single("image"), postAddItem);
itemRouter
  .route("/edit/:itemType/:itemId")
  .all(loggedInUserOnly)
  .get(getEditItem)
  .post(uploadFiles.single("image"), postEditItem);
itemRouter.post("/delete/:itemType/:itemId", loggedInUserOnly, postDeleteItem);
itemRouter.post("/delete/:itemIds", loggedInUserOnly, postDeleteItems);
itemRouter.get("/detail/:itemType/:itemId", loggedInUserOnly, getDetailItem);
itemRouter.get("/pinned", loggedInUserOnly, getPinnedItems);
itemRouter.post("/pinning/:itemType/:itemId", loggedInUserOnly, postPinning);

export default itemRouter;
