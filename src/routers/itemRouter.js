import express from "express";
import {
  getAddExpense,
  getAddIncome,
  getDetailItem,
  getEditItem,
  getPinnedItems,
  postAddExpense,
  postAddIncome,
  postAddPin,
  postDeleteItem,
  postDeleteItems,
  postEditItem,
  postRemovePin,
} from "../controllers/itemController";
import { loggedInUserOnly } from "../middlewares";

const itemRouter = express.Router();

itemRouter
  .route("/add-expense")
  .all(loggedInUserOnly)
  .get(getAddExpense)
  .post(postAddExpense);
itemRouter
  .route("/add-income")
  .all(loggedInUserOnly)
  .get(getAddIncome)
  .post(postAddIncome);
itemRouter
  .route("/edit/:type/:itemId")
  .all(loggedInUserOnly)
  .get(getEditItem)
  .post(postEditItem);
itemRouter.post("/delete/:type/:itemId", loggedInUserOnly, postDeleteItem);
itemRouter.post("/delete/:itemIds", loggedInUserOnly, postDeleteItems);
itemRouter.get("/detail/:type/:itemId", loggedInUserOnly, getDetailItem);
itemRouter.get("/pinned-items", loggedInUserOnly, getPinnedItems);
itemRouter.post("/add-pin/:type/:itemId", loggedInUserOnly, postAddPin);
itemRouter.post("/remove-pin/:itemId", loggedInUserOnly, postRemovePin);

export default itemRouter;
