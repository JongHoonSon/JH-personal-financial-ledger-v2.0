import express from "express";
import {
  getAddExpense,
  getAddIncome,
  getDetailItem,
  getEditItem,
  getPinnedItems,
  postAddExpense,
  postAddIncome,
  postPinning,
  postDeleteItem,
  postDeleteItems,
  postEditItem,
} from "../controllers/itemController";
import { loggedInUserOnly, uploadFiles } from "../middlewares";

const itemRouter = express.Router();

itemRouter
  .route("/add-expense")
  .all(loggedInUserOnly)
  .get(getAddExpense)
  .post(uploadFiles.single("image"), postAddExpense);
itemRouter
  .route("/add-income")
  .all(loggedInUserOnly)
  .get(getAddIncome)
  .post(uploadFiles.single("image"), postAddIncome);
itemRouter
  .route("/edit/:type/:itemId")
  .all(loggedInUserOnly)
  .get(getEditItem)
  .post(postEditItem);
itemRouter.post("/delete/:type/:itemId", loggedInUserOnly, postDeleteItem);
itemRouter.post("/delete/:itemIds", loggedInUserOnly, postDeleteItems);
itemRouter.get("/detail/:type/:itemId", loggedInUserOnly, getDetailItem);
itemRouter.get("/pinned-items", loggedInUserOnly, getPinnedItems);
itemRouter.post("/pinning/:type/:itemId", loggedInUserOnly, postPinning);

export default itemRouter;
