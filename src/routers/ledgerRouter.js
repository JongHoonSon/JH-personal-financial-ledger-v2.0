import express from "express";
import {
  getAddItem,
  getChart,
  getDetailItem,
  getEditItem,
  getLedger,
  postAddItem,
  postAddPin,
  postDeleteItem,
  postDeleteItems,
  postEditItem,
  postRemovePin,
} from "../controllers/ledgerController";

const ledgerRouter = express.Router();

ledgerRouter.get("/:yyyy([0-9]{4})-:mm([0-9]{2})", getLedger);
ledgerRouter.route("/add-item").get(getAddItem).post(postAddItem);
ledgerRouter.route("/edit-item/:itemId").get(getEditItem).post(postEditItem);
ledgerRouter.post("/delete-item/:itemId", postDeleteItem);
ledgerRouter.post("/delete-items/:itemIds", postDeleteItems);
ledgerRouter.get("/detail-item/:itemId", getDetailItem);
ledgerRouter.get("/chart", getChart);
ledgerRouter.post("/add-pin/:itemId", postAddPin);
ledgerRouter.post("/remove-pin/:itemId", postRemovePin);

export default ledgerRouter;
