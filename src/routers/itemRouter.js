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
import { userOnlyMiddleware } from "../middlewares";

const itemRouter = express.Router();

itemRouter
  .route("/add-expense")
  .all(userOnlyMiddleware)
  .get(getAddExpense)
  .post(postAddExpense);
itemRouter
  .route("/add-income")
  .all(userOnlyMiddleware)
  .get(getAddIncome)
  .post(postAddIncome);
itemRouter
  .route("/edit/:type/:itemId")
  .all(userOnlyMiddleware)
  .get(getEditItem)
  .post(postEditItem);
itemRouter.post("/delete/:type/:itemId", userOnlyMiddleware, postDeleteItem);
itemRouter.post("/delete/:itemIds", userOnlyMiddleware, postDeleteItems);
itemRouter.get("/detail/:type/:itemId", userOnlyMiddleware, getDetailItem);
itemRouter.get("/pinned-items", userOnlyMiddleware, getPinnedItems);
itemRouter.post("/add-pin/:type/:itemId", userOnlyMiddleware, postAddPin);
itemRouter.post("/remove-pin/:itemId", userOnlyMiddleware, postRemovePin);

export default itemRouter;
