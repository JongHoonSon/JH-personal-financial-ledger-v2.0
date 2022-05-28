import express from "express";
import {
  getLedgerDaily,
  getLedgerWeekly,
  getLedgerMonthly,
  getLedgerYearly,
} from "../controllers/ledgerController";

const ledgerRouter = express.Router();

ledgerRouter.get("/:yyyy([0-9]{4})-:mm([0-9]{2})/Daily", getLedgerDaily);
ledgerRouter.get("/:yyyy([0-9]{4})-:mm([0-9]{2})/Weekly", getLedgerWeekly);
ledgerRouter.get("/:yyyy([0-9]{4})-:mm([0-9]{2})/Monthly", getLedgerMonthly);
ledgerRouter.get("/Yearly", getLedgerYearly);

export default ledgerRouter;
