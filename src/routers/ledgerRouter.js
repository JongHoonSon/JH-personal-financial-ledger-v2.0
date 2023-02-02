import express from "express";
import { ledgerController } from "../controllers";

const ledgerRouter = express.Router();

ledgerRouter.get(
  "/:yyyy([0-9]{4})-:mm([0-9]{2})-:dd([0-9]{2})/daily/:itemType",
  ledgerController.getLedgerDaily
);

ledgerRouter.get(
  "/:yyyy([0-9]{4})-:mm([0-9]{2})-:dd([0-9]{2})/weekly/:itemType",
  ledgerController.getLedgerWeekly
);

ledgerRouter.get(
  "/:yyyy([0-9]{4})-:mm([0-9]{2})/monthly/:itemType",
  ledgerController.getLedgerMonthly
);

ledgerRouter.get(
  "/:yyyy([0-9]{4})/yearly/:itemType",
  ledgerController.getLedgerYearly
);

export default ledgerRouter;
