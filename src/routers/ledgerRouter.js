import express from "express";
import { ledgerController } from "../controllers";
import { loginRequiredPage } from "../middlewares";

const ledgerRouter = express.Router();

ledgerRouter.get(
  "/:yyyy([0-9]{4})-:mm([0-9]{2})-:dd([0-9]{2})/daily/:itemType",
  loginRequiredPage,
  ledgerController.getLedgerDaily
);
ledgerRouter.get(
  "/:yyyy([0-9]{4})-:mm([0-9]{2})-:dd([0-9]{2})/weekly/:itemType",
  loginRequiredPage,
  ledgerController.getLedgerWeekly
);
ledgerRouter.get(
  "/:yyyy([0-9]{4})-:mm([0-9]{2})/monthly/:itemType",
  loginRequiredPage,
  ledgerController.getLedgerMonthly
);
ledgerRouter.get(
  "/:yyyy([0-9]{4})/yearly/:itemType",
  loginRequiredPage,
  ledgerController.getLedgerYearly
);

export default ledgerRouter;
