import express from "express";
import {
  getLedgerDaily,
  getLedgerWeekly,
  getLedgerMonthly,
  getLedgerYearly,
} from "../controllers/ledgerController";

const ledgerRouter = express.Router();

ledgerRouter.get("/:yyyy([0-9]{4})-:mm([0-9]{2})/daily", getLedgerDaily);
ledgerRouter.get("/:yyyy([0-9]{4})-:mm([0-9]{2})/weekly", getLedgerWeekly);
ledgerRouter.get("/:yyyy([0-9]{4})-:mm([0-9]{2})/monthly", getLedgerMonthly);
ledgerRouter.get("/yearly", getLedgerYearly);

export default ledgerRouter;
