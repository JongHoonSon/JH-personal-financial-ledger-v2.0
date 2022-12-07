import express from "express";
import { ledgerController } from "../controllers";
import { loggedInUserOnly } from "../middlewares";

const ledgerRouter = express.Router();

ledgerRouter.get(
  "/:yyyy([0-9]{4})-:mm([0-9]{2})-:dd([0-9]{2})/daily/:itemType",
  loggedInUserOnly,
  ledgerController.getLedgerDaily
);
ledgerRouter.get(
  "/:yyyy([0-9]{4})-:mm([0-9]{2})-:dd([0-9]{2})/weekly/:itemType",
  loggedInUserOnly,
  ledgerController.getLedgerWeekly
);
ledgerRouter.get(
  "/:yyyy([0-9]{4})-:mm([0-9]{2})/monthly/:itemType",
  loggedInUserOnly,
  ledgerController.getLedgerMonthly
);
ledgerRouter.get(
  "/:yyyy([0-9]{4})/yearly/:itemType",
  loggedInUserOnly,
  ledgerController.getLedgerYearly
);

export default ledgerRouter;
