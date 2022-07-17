import express from "express";
import {
  getLedgerDaily,
  getLedgerWeekly,
  getLedgerMonthly,
  getLedgerYearly,
} from "../controllers/ledgerController";
import { userOnlyMiddleware } from "../middlewares";

const ledgerRouter = express.Router();

ledgerRouter.get(
  "/:yyyy([0-9]{4})-:mm([0-9]{2})-:dd([0-9]{2})/daily",
  userOnlyMiddleware,
  getLedgerDaily
);
ledgerRouter.get(
  "/:yyyy([0-9]{4})-:mm([0-9]{2})-:dd([0-9]{2})/weekly",
  userOnlyMiddleware,
  getLedgerWeekly
);
ledgerRouter.get(
  "/:yyyy([0-9]{4})-:mm([0-9]{2})/monthly",
  userOnlyMiddleware,
  getLedgerMonthly
);
ledgerRouter.get(
  "/:yyyy([0-9]{4})/yearly",
  userOnlyMiddleware,
  getLedgerYearly
);

export default ledgerRouter;
