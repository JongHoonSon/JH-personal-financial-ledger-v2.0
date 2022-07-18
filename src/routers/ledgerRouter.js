import express from "express";
import {
  getLedgerDaily,
  getLedgerWeekly,
  getLedgerMonthly,
  getLedgerYearly,
} from "../controllers/ledgerController";
import { loggedInUserOnly } from "../middlewares";

const ledgerRouter = express.Router();

ledgerRouter.get(
  "/:yyyy([0-9]{4})-:mm([0-9]{2})-:dd([0-9]{2})/daily",
  loggedInUserOnly,
  getLedgerDaily
);
ledgerRouter.get(
  "/:yyyy([0-9]{4})-:mm([0-9]{2})-:dd([0-9]{2})/weekly",
  loggedInUserOnly,
  getLedgerWeekly
);
ledgerRouter.get(
  "/:yyyy([0-9]{4})-:mm([0-9]{2})/monthly",
  loggedInUserOnly,
  getLedgerMonthly
);
ledgerRouter.get("/:yyyy([0-9]{4})/yearly", loggedInUserOnly, getLedgerYearly);

export default ledgerRouter;
