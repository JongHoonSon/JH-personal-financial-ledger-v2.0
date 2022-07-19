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
  .route("/add-item/:itemType")
  .all(loggedInUserOnly)
  .get(getAddItem)
  .post(uploadFiles.single("image"), postAddItem);
itemRouter
  .route("/edit/:type/:itemId")
  .all(loggedInUserOnly)
  .get(getEditItem)
  .post(uploadFiles.single("image"), postEditItem);
itemRouter.post("/delete/:type/:itemId", loggedInUserOnly, postDeleteItem);
itemRouter.post("/delete/:itemIds", loggedInUserOnly, postDeleteItems);
itemRouter.get("/detail/:type/:itemId", loggedInUserOnly, getDetailItem);
itemRouter.get("/pinned-items", loggedInUserOnly, getPinnedItems);
itemRouter.post("/pinning/:type/:itemId", loggedInUserOnly, postPinning);

export default itemRouter;
