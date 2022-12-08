import express from "express";
import { ledgerController } from "../controllers";
import { checkUserLoggedIn } from "../middlewares";

const ledgerRouter = express.Router();

ledgerRouter.get(
  "/:yyyy([0-9]{4})-:mm([0-9]{2})-:dd([0-9]{2})/daily/:itemType",
  checkUserLoggedIn,
  ledgerController.getLedgerDaily
);
ledgerRouter.get(
  "/:yyyy([0-9]{4})-:mm([0-9]{2})-:dd([0-9]{2})/weekly/:itemType",
  checkUserLoggedIn,
  ledgerController.getLedgerWeekly
);
ledgerRouter.get(
  "/:yyyy([0-9]{4})-:mm([0-9]{2})/monthly/:itemType",
  checkUserLoggedIn,
  ledgerController.getLedgerMonthly
);
ledgerRouter.get(
  "/:yyyy([0-9]{4})/yearly/:itemType",
  checkUserLoggedIn,
  ledgerController.getLedgerYearly
);

export default ledgerRouter;
