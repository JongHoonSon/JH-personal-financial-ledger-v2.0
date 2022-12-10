import express from "express";
import { ledgerController } from "../controllers";
import { loginRequired } from "../middlewares";

const ledgerRouter = express.Router();

ledgerRouter.get(
  "/:yyyy([0-9]{4})-:mm([0-9]{2})-:dd([0-9]{2})/daily/:itemType",
  loginRequired,
  ledgerController.getLedgerDaily
);
ledgerRouter.get(
  "/:yyyy([0-9]{4})-:mm([0-9]{2})-:dd([0-9]{2})/weekly/:itemType",
  loginRequired,
  ledgerController.getLedgerWeekly
);
ledgerRouter.get(
  "/:yyyy([0-9]{4})-:mm([0-9]{2})/monthly/:itemType",
  loginRequired,
  ledgerController.getLedgerMonthly
);
ledgerRouter.get(
  "/:yyyy([0-9]{4})/yearly/:itemType",
  loginRequired,
  ledgerController.getLedgerYearly
);

export default ledgerRouter;
