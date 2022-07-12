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

const itemRouter = express.Router();

itemRouter.route("/add-expense").get(getAddExpense).post(postAddExpense);
itemRouter.route("/add-income").get(getAddIncome).post(postAddIncome);
itemRouter.route("/edit/:itemId").get(getEditItem).post(postEditItem);
itemRouter.post("/delete/:itemId", postDeleteItem);
itemRouter.post("/delete/:itemIds", postDeleteItems);
itemRouter.get("/detail/:type/:itemId", getDetailItem);
itemRouter.get("/pinned", getPinnedItems);
itemRouter.post("/add-pin/:itemId", postAddPin);
itemRouter.post("/remove-pin/:itemId", postRemovePin);

export default itemRouter;
